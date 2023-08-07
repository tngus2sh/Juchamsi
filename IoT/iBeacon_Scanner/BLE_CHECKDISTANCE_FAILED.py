
import ble_803
import sys
import requests
import bluetooth._bluetooth as bluez
import time
import math
import uuid
import requests
import numpy as np

searched_distance = [0.0, 0.0, 0.0, 0.0]

def trilateration(p1, p2, p3, r1, r2, r3):
    # print(p1, p2, p3, r1, r2, r3)
    A = 2.0*(p2[0] - p1[0])
    B = 2.0*(p2[1] - p1[1])
    C = 2.0*(p3[0] - p1[0])
    D = 2.0*(p3[1] - p1[1])
    # print(A, B, C, D)
    E = r1**2 - r2**2 - p1[0]**2 - p1[1]**2 + p2[0]**2 + p2[1]**2
    F = r1**2 - r3**2 - p1[0]**2 - p1[1]**2 + p3[0]**2 + p3[1]**2
    
    mat = np.array([[A, B], [C, D]])
    constants = np.array([E, F])
    
    result = np.linalg.solve(mat, constants)
    x, y = result
    # print("{:.6f}, {:.6f}".format(x, y))
    return (x, y)

beacon_coordinates ={
	'beacon1':([0.0, 0.0]),
	'beacon2':([0.0,2.4]),
	'beacon3':([1.2,0.0]),
	'beacon4':([1.2,2.4])
}
beacon_pairs =[
	('beacon1', 'beacon2', 'beacon3'),
	('beacon1', 'beacon2', 'beacon4'),
	('beacon1', 'beacon3', 'beacon4'),
	('beacon2', 'beacon3', 'beacon4')
]
dist_combinations = [
    (searched_distance[0], searched_distance[1], searched_distance[2]),
    (searched_distance[0], searched_distance[1], searched_distance[3]),
    (searched_distance[1], searched_distance[2], searched_distance[3]),
    (searched_distance[0], searched_distance[2], searched_distance[3])
]

def  getMacAddress():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join(mac[i:i+2] for i in range(0,12,2))

def cal_dis(rssi, tx):
    path_loss_exponent = 2  # Free-space path loss exponent.
    return 10 ** ((tx_power - rssi) / (10 * path_loss_exponent))

def cal_triangle_center(beacon1, beacon2, beacon3):
	x1, y1 = beacon_coordinates[beacon1]
	x2, y2 = beacon_coordinates[beacon2]
	x3, y3 = beacon_coordinates[beacon3]

	center_x = (x1+x2+x3)/3.0
	center_y = (y1+y2+y3)/3.0

	return center_x, center_y

url="https://e6f5-121-178-98-21.ngrok-free.app/parking/entrance"
datas={}
ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52', '40:91:51:fc:fd:6a']
module_info = [['0','0'],
			   ['0','0'],
			   ['0','0'],
			   ['0','0']]
searched = ['0','0','0','0']

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
                # print(comp_str)
                # ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
                sendData = beacon.split(',')
                print sendData[0], sendData[5]
                ratio = float(sendData[5])*1.0/float(sendData[4])
                dis = 10**((27.55-(20*math.log10(2400))+math.fabs(ratio))/20.0)
                if(len(sendData)==6):
				    sendData.append(dis)
                if beacon[0:17] not in searched and beacon[0:17] in ground_module:
                    # save moudle name and distance
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

                    elif(beacon[0:17] == ground_module[4]):
                        searched[0] = beacon[0:17]
                        searched_distance[0] = dis*100
                        searched[1] = beacon[0:17]
                        searched_distance[1] = dis*100
                        searched[2] = beacon[0:17]
                        searched_distance[2] = dis*100
                        searched[3] = beacon[0:17]
                        searched_distance[3] = dis*100

                # if measure all distance
                if '0' not in searched:
                    for (beacon1, beacon2, beacon3), (r1, r2, r3) in zip(beacon_pairs, dist_combinations):
                        p1 = beacon_coordinates[beacon1]
                        p2 = beacon_coordinates[beacon2]
                        p3 = beacon_coordinates[beacon3]
                        # print(searched_distance)
                        r1 = searched_distance[0]
                        r2 = searched_distance[1]
                        r3 = searched_distance[2]
                        # print(r1, r2, r3)
                        estimated_position = trilateration(p1, p2, p3, r1, r2, r3)
                        # print(beacon1, beacon2, beacon3, estimated_position, 'dddd')
                        center_x, center_y = cal_triangle_center(beacon1, beacon2, beacon3)
                        center_x, center_y = trilateration(p1, p2, p3, r1, r2, r3)
                        searched_x.append(center_x)
                        searched_y.append(center_y)
                        # print(searched_x, searched_y, 'hihihi')
                        if len(searched_x)==4:
                            # print(searched_x)
                            # print(searched_y)
                            # print(center_x, center_y)
                            myXLocation = sum(searched_x)/4.0
                            myYLocation = sum(searched_y)/4.0
                            # print(myXLocation)
                            # print(myYLocation)
                            # print(searched)
                            if 0<=myXLocation<1.2 and 0<=myYLocation<0.6:
                                zone = 1
                            elif 1.2<=myXLocation<2.4 and 0<=myYLocation<0.6:
                                zone = 2
                            elif 0<=myXLocation<1.2 and 0.6<=myYLocation<1.2:
                                zone = 3
                            elif 1.2<=myXLocation<2.4 and 1.5<=myYLocation<1.2:
                                zone = 4
                            # print(zone)
                            # print(searched_distance)
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
	# time.sleep(0.2)