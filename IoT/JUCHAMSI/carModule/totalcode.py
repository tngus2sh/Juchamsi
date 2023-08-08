
import ble_803
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
    parking_url="https://453d-121-178-98-21.ngrok-free.app/parking/entrance"
    exit_url = "https://453d-121-178-98-21.ngrok-free.app/parking/exit"
    # url="https://e6f5-121-178-98-21.ngrok-free.app/parking/entrance"
    datas={}
    ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52', '40:91:51:fc:fd:6a']
    searched = [0, 0, 0, 0, 0]
    park_state = []
    lastSonarValues = {}
    

    dev_id = 0
    try:
        sock = bluez.hci_open_dev(dev_id)
        print "ble thread started"

    except:
        print "error accessing bluetooth device..."
        sys.exit(1)

    ble_803.hci_le_set_scan_parameters(sock)
    ble_803.hci_enable_le_scan(sock)

    while True:
        repeat += 1
        returnedList = ble_803.parse_events(sock, 10)
        print "----------"
        if repeat == 10 and cnt == 0:
            print('not park')
            return
        if repeat == 300:
            print('signal_disconnect')
            return
        for beacon in returnedList:
            for comp_str in ground_module:
                if(beacon[0:17]==comp_str):
                    cnt += 1
                    # ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
                    sendData = beacon.split(',')
                    print(sendData)

                    nowSonar = int(sendData[2])
                    if nowSonar not in sonarCount:
                        sonarCount[nowSonar] = 0
                    sonarCount[nowSonar] += 1
                    lastSonarValues[beacon[0:17]] = sendData[2]
                    # measure dis
                    # ratio = float(sendData[5])*1.0/float(sendData[4])
                    # dis = 10**((27.55-(20*math.log10(2400))+math.fabs(ratio))/20.0)

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
                        elif(beacon[0:17] == ground_module[4]):
                            searched[4] +=1

                        # send Frequency
                        if cnt == 100:
                            rpiMac = getMacAddress()
                            mostFreqSonar = max(sonarCount, key = sonarCount.get)
                            mostFrequentMacIndex = searched.index(max(searched))
                            mostFrequentMac = ground_module[mostFrequentMacIndex]
                            mostRecentSonar = lastSonarValues[mostFrequentMac]
                            # print(max(searched))
                            # print(searched)
                            print(rpiMac, mostRecentSonar)
                            # print searched.index(max(searched))
                            if int(mostRecentSonar) < 30:
                                print(nowParking[mostFrequentMacIndex])
                                if nowParking[mostFrequentMacIndex] == 0:
                                    headers = {'Content-Type': 'application/json'}
                                    datas ={'macAddress': rpiMac, 'groundAddress': ground_module[searched.index(max(searched))]}
                                    nowParking[mostFrequentMacIndex] = 1
                                    print(nowParking[mostFrequentMacIndex])
                                    print('car_in')
                                    json_data = json.dumps(datas)
                                    response = requests.post(parking_url, data=json_data, headers=headers)
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

 

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
    ser.flush
    nowParking = [0, 0, 0, 0, 0]
    while True:
        if ser.in_waiting>0:
            line = ser.readline().decode('utf-8').rstrip()
            parts = line.split(": ")
            if len(parts)>=2:
                change_value = float(parts[1])
                print(line)
                print(change_value)
            # car move
            if change_value > 10:
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
	# time.sleep(0.2)