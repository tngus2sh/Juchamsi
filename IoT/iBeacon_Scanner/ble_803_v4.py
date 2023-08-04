import ble_803
import sys
import requests
import bluetooth._bluetooth as bluez
import time
import math
import uuid

beacon_coordinates ={
    'beacon1':(0, 0),
    'beacon2':(0,3),
    'beacon3':(3,0),
    'beacon4':(3,3)
}
beacon_pairs =[
    ('beacon1', 'beacon2', 'beacon3'),
    ('beacon1', 'beacon2', 'beacon4'),
    ('beacon1', 'beacon3', 'beacon4'),
    ('beacon2', 'beacon3', 'beacon4')
]

def  getMacAddress():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join(mac[i:i+2] for i in range(0,12,2))

def cal_dis(rssi, tx):
    ratio = rssi *1.0/tx
    # Adjust the coefficients below according to the actual environment
    dis = 10 ** ((27.55-(20*math.log10(2400))+math.fabs(ratio))/20.0)
    return dis

def cal_triangle_center(beacon1, beacon2, beacon3):
    x1, y1 = beacon_coordinates[beacon1]
    x2, y2 = beacon_coordinates[beacon2]
    x3, y3 = beacon_coordinates[beacon3]

    center_x = (x1+x2+x3)/3
    center_y = (y1+y2+y3)/3

    return center_x, center_y

url="https://e6f5-121-178-98-21.ngrok-free.app/parking/entrance"
datas={}
ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52']

searched = ['0','0','0','0']
searched_distance = [0.0, 0.0, 0.0, 0.0]
searched_x = []
searched_y = []

dev_id = 0
myXLocation = 0
myYLocation = 0
zone = 0

try:
    sock = bluez.hci_open_dev(dev_id)
    print "ble thread started"

except:
    print "error accessing bluetooth device..."
    sys.exit(1)

ble_803.hci_le_set_scan_parameters(sock)
ble_803.hci_enable_le_scan(sock)

while True:
    returnedList = ble_803.parse_events(sock, 10)
    print "----------"
    for beacon in returnedList:
        for comp_str in ground_module:
            if(beacon[0:17]==comp_str):
                # ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
                sendData = beacon.split(',')
                ratio = float(sendData[5])*1.0/float(sendData[4])
                dis = 10**((27.55-(20*math.log10(2400))+math.fabs(ratio))/20.0)
                if(len(sendData)==6):
				    sendData.append(dis)
                if beacon[0:17] not in searched and beacon[0:17] in ground_module:
                    if(beacon[0:17] == ground_module[0]):
                        searched[0] = beacon[0:17]
                        searched_distance[0] = dis*100
                    elif(beacon[0:17] == ground_module[1]):
                        searched[1] = beacon[0:17]
                        searched_distance[1] = dis*100
                    elif(beacon[0:17] == ground_module[2]):
                        searched[2] = beacon[0:17]
                        searched_distance[2] = dis*100
                    elif(beacon[0:17] == ground_module[3]):
                        searched[3] = beacon[0:17]
                        searched_distance[3] = dis*100
                if '0' not in searched:
                    for beacon1, beacon2, beacon3 in beacon_pairs:
                        center_x, center_y = cal_triangle_center(beacon1, beacon2, beacon3)
                        searched_x.append(center_x)
                        searched_y.append(center_y)
                        print(searched_x, searched_y, 'hihihi')
                        if len(searched_x)==4:
                            print(center_x, center_y)
                            myXLocation = sum(searched_x)/4.0
                            myYLocation = sum(searched_y)/4.0
                            print(myXLocation)
                            print(myYLocation)
                            print(searched)
                            if 0<=myXLocation<1.5 and 0<=myYLocation<1.5:
                                zone = 1
                            elif 1.5<=myXLocation<3 and 0<=myYLocation<1.5:
                                zone = 2
                            elif 0<=myXLocation<1.5 and 1.5<=myYLocation<3:
                                zone = 3
                            elif 1.5<=myXLocation<3 and 1.5<=myYLocation<3:
                                zone = 4
                            print(zone)
                            print(searched_distance)
                            rpiMac = getMacAddress()
                            # print(rpiMac)
                            datas ={'macAddress': rpiMac, 'zone': zone}
                            response = requests.post(url, data=datas)
                            searched_x=[]
                            searched_y=[]
                            myXLocation = 0
                            myYLocation = 0
                            zone=0
                            module_info = [['0','0'],
                                ['0','0'],
                                ['0','0'],
                                ['0','0']]
                            searched = ['0','0','0','0']
                            searched_distance = [0.0, 0.0, 0.0, 0.0]
                            searched_x = []
                            searched_y = []
    time.sleep(1)