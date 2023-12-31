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
    parking_url="https://i9c107.p.ssafy.io/api/parking/entrance"
    exit_url = "https://i9c107.p.ssafy.io/api/parking/exit"
    soundModuleUrl = "http://172.20.10.9:80/"
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


    target_mac = None
    if 1 in nowParking:
        target_mac = ground_module[nowParking.index(1)]

    while True:
        repeat += 1
        returnedList = advertiseMac.parse_events(sock, 10)
        print "----------"

        if target_mac:
            returnedList = [beacon for beacon in returnedList if beacon[0:17] == target_mac]

        for beacon in returnedList:
            for comp_str in ground_module:
                if(beacon[0:17]==comp_str):
                    cnt += 1
                    repeat = 0
                    sendData = beacon.split(',')
                    print(sendData)

                    nowSonar = int(sendData[2])
                    if nowSonar not in sonarCount:
                        sonarCount[nowSonar] = 0
                    sonarCount[nowSonar] += 1
                    lastSonarValues[beacon[0:17]] = sendData[2]

                    # measure Frequency
                    if beacon[0:17] not in searched and beacon[0:17] in ground_module:
                        if(beacon[0:17] == ground_module[0]):
                            searched[0] += 1
                        elif(beacon[0:17] == ground_module[1]):
                            searched[1] += 1
                        elif(beacon[0:17] == ground_module[2]):
                            searched[2] += 1
                        elif(beacon[0:17] == ground_module[3]):
                            searched[3] += 1

                        # send Frequency
                        if cnt == 80:
                            rpiMac = getMacAddress()
                            mostFreqSonar = max(sonarCount, key = sonarCount.get)
                            mostFrequentMacIndex = searched.index(max(searched))
                            mostFrequentMac = ground_module[mostFrequentMacIndex]
                            mostRecentSonar = lastSonarValues[mostFrequentMac]
                            print(rpiMac, mostRecentSonar, mostFrequentMac)
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
                            print searched.index(max(searched)), mostRecentSonar
                            return searched.index(max(searched))

        if repeat == 30 and target_mac:
            print('carout')
            index_of_target = ground_module.index(target_mac)
            nowParking[index_of_target] = 0
            headers = {'Content-Type': 'application/json'}
            datas = {'macAddress': getMacAddress()}
            json_data = json.dumps(datas)
            try:
                response = requests.post(exit_url, data=json_data, headers=headers)
                print("Successfully sent POST request to exit_url.")
            except Exception as e:
                print("Failed to send request to exit_url. Error: {}".format(e))
            return

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
        time.sleep(1)
        test = scan_bluetooth()