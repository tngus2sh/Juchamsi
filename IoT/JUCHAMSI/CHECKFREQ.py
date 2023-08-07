
import ble_803
import sys
import requests
import bluetooth._bluetooth as bluez
import time
import math
import uuid
import requests
import numpy as np

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
    parking_url="https://3dff-121-178-98-21.ngrok-free.app/parking/entrance"
    exit_url = "https://3dff-121-178-98-21.ngrok-free.app/parking/exit"
    # url="https://e6f5-121-178-98-21.ngrok-free.app/parking/entrance"
    datas={}
    ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52', '40:91:51:fc:fd:6a']
    searched = [0, 0, 0, 0, 0]

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
                            # print(max(searched))
                            # print(searched)
                            # print(rpiMac)
                            # print searched.index(max(searched))
                            if mostFreqSonar < 30:
                                datas ={'macAddress': rpiMac, 'groundAddress': ground_module[searched.index(max(searched))]}
                                print('car_in') 
                                response = requests.post(parking_url, data=datas)
                            else:
                                datas = {'macAddress': rpiMac}
                                print('car_out')
                                response = requests.post(exit_url, data=datas)
                            print searched.index(max(searched)), mostFreqSonar
                            return searched.index(max(searched))
 

if __name__ == '__main__':
    scan_bluetooth()
	# time.sleep(0.2)