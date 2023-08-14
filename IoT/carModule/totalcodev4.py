import advertiseMac
import sys
import requests
import bluetooth._bluetooth as bluez
import math
import uuid
import requests
import numpy as np
import json
import serial
import time
import smbus

PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B
ACCEL_YOUT_H = 0x3D
ACCEL_ZOUT_H = 0x3F
GYRO_XOUT_H = 0x43
GYRO_YOUT_H = 0x45
GYRO_ZOUT_H = 0x47

def read_i2c_word(bus, address, reg):
    high = bus.read_byte_data(address, reg)
    low = bus.read_byte_data(address, reg + 1)
    val = (high << 8) + low
    return val

def read_mpu6050():
    bus = smbus.SMBus(1)  # for Raspberry Pi 3, use 1 for older versions use 0
    address = 0x68  # MPU6050 address

    # Wake up the MPU6050
    bus.write_byte_data(address, PWR_MGMT_1, 0)

    accel_x = read_i2c_word(bus, address, ACCEL_XOUT_H)
    accel_y = read_i2c_word(bus, address, ACCEL_YOUT_H)
    accel_z = read_i2c_word(bus, address, ACCEL_ZOUT_H)

    gyro_x = read_i2c_word(bus, address, GYRO_XOUT_H)
    gyro_y = read_i2c_word(bus, address, GYRO_YOUT_H)
    gyro_z = read_i2c_word(bus, address, GYRO_ZOUT_H)

    return accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z

def  getMacAddress():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join(mac[i:i+2] for i in range(0,12,2))

def cal_dis(rssi, tx):
    path_loss_exponent = 2  # Free-space path loss exponent.
    return 10 ** ((tx_power - rssi) / (10 * path_loss_exponent))

def scan_bluetooth():
    sonarCount = {}
    state = 0
    cnt = 0
    repeat = 0
    # parking_url="http://i9c107.p.ssafy.io:8080/parking/entrance"
    # exit_url = "http://i9c107.p.ssafy.io:8080/parking/exit"
    parking_url="https://419c-121-178-98-21.ngrok-free.app/parking/entrance"
    exit_url="https://419c-121-178-98-21.ngrok-free.app/parking/exit"
    soundModuleUrl = "http://172.20.10.9/"
    datas={}
    ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52']
    searched = [0, 0, 0, 0]
    park_state = []
    lastSonarValues = {}
    

    dev_id = 0
    try:
        sock = bluez.hci_open_dev(dev_id)
        print "ble thread started"

    except:
        print "error accessing bluetooth device..."
        sys.exit(1)

    advertiseMac.hci_le_set_scan_parameters(sock)
    advertiseMac.hci_enable_le_scan(sock)

    while True:
        repeat += 1
        returnedList = advertiseMac.parse_events(sock, 10)
        print "----------"
        if repeat == 20:
            print('not park')
            print(nowParking)
            if 1 in nowParking:
                print('carout')
                index_of_one = nowParking.index(1)
                nowParking[index_of_one] = 0  # Set the corresponding nowParking value to 0
                headers = {'Content-Type': 'application/json'}
                datas = {'macAddress': getMacAddress()}
                json_data = json.dumps(datas)
                try:
                    response = requests.post(exit_url, data=json_data, headers=headers)
                    print("Successfully sent POST request to exit_url.")
                except Exception as e:
                    print("Failed to send request to exit_url. Error: {}".format(e))
            return

        for beacon in returnedList:
            for comp_str in ground_module:
                if(beacon[0:17]==comp_str):
                    cnt += 1
                    repeat = 0
                    # ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
                    sendData = beacon.split(',')
                    print(sendData)

                    nowSonar = int(sendData[2])
                    if nowSonar not in sonarCount:
                        sonarCount[nowSonar] = 0
                    sonarCount[nowSonar] += 1
                    lastSonarValues[beacon[0:17]] = sendData[2]

                    # measure Frequency
                    if beacon[0:17] not in searched and beacon[0:17] in ground_module:
                        # save moudle name and distance
                        if(beacon[0:17] == ground_module[0]):
                            searched[0] += 1
                        elif(beacon[0:17] == ground_module[1]):
                            searched[1] += 1
                        elif(beacon[0:17] == ground_module[2]):
                            searched[2] += 1
                        elif(beacon[0:17] == ground_module[3]):
                            searched[3] += 1

                        # send Frequency
                        if cnt == 100:
                            rpiMac = getMacAddress()
                            mostFreqSonar = max(sonarCount, key = sonarCount.get)
                            mostFrequentMacIndex = searched.index(max(searched))
                            mostFrequentMac = ground_module[mostFrequentMacIndex]
                            mostRecentSonar = lastSonarValues[mostFrequentMac]
                            # print(max(searched))
                            # print(searched)
                            print(rpiMac, mostRecentSonar, mostFrequentMac)
                            # print searched.index(max(searched))
                            if int(mostRecentSonar) < 30:
                                print(nowParking[mostFrequentMacIndex])
                                if nowParking[mostFrequentMacIndex] == 0:
                                    headers = {'Content-Type': 'application/json'}
                                    datas ={'macAddress': rpiMac, 'groundAddress': ground_module[searched.index(max(searched))]}
                                    json_data = json.dumps(datas)
                                    try:
                                        nowParking[mostFrequentMacIndex] = 1
                                        print(nowParking[mostFrequentMacIndex])
                                        print('car_in')
                                        response = requests.post(parking_url, data=json_data, headers=headers, timeout=1)
                                        try:
                                            response = requests.post(soundModuleUrl, data=json_data, headers=headers, timeout=1)
                                        except Exception as e:
                                            print("Failed to send request to soundModuleUrl. Error: {}".format(e))
                                    except Exception as e:
                                        print("Failed BackServer")
                                        nowParking[mostFrequentMacIndex] = 0
                                    
                            else:
                                if nowParking[mostFrequentMacIndex] == 1:
                                    headers = {'Content-Type': 'application/json'}
                                    datas = {'macAddress': rpiMac}
                                    nowParking[mostFrequentMacIndex] = 0
                                    print('car_out')
                                    json_data = json.dumps(datas)
                                    response = requests.post(exit_url, data=json_data, headers=headers)
                            print searched.index(max(searched)), mostRecentSonar
                            return searched.index(max(searched))

def safe_readline(ser):
    try:
        return ser.readline().decode('utf-8').rstrip()
    except serial.serialutil.SerialException:
        print("Serial connection error. Trying to reconnect...")
        time.sleep(1)
        try:
            ser.close()
            ser.open()
            return ""
        except:
            print("Failed to reconnect. Retrying...")
            time.sleep(1)
            return ""
def get_acceleration_magnitude():
    accel_x, accel_y, accel_z, _, _, _ = read_mpu6050()
    magnitude = math.sqrt(accel_x**2 + accel_y**2 + accel_z**2)
    return magnitude

if __name__ == '__main__':
    nowParking = [0, 0, 0, 0]
    while True:
        magnitude = get_acceleration_magnitude()
        print("Acceleration Magnitude:", magnitude)
        time.sleep(0.2)
        # car move
        if magnitude > 60000:
            print "plus 10"
            time.sleep(5)
            test = scan_bluetooth()
            print(test)
            # need to send move signal
        # car stop
        else:
            # need to search bluetooth
            print "stop"
            pass