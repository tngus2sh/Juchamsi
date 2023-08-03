# test BLE Scanning software
# jcs 6/8/2014

import ble_803
import sys
import requests
import bluetooth._bluetooth as bluez
import time
import math
beacon_coordinates ={
	'beacon1':(0, 0),
	'beacon2':(0,10),
	'beacon3':(10,0),
	'beacon4':(10,10)
}
beacon_pairs =[
	('beacon1', 'beacon2', 'beacon3'),
	('beacon1', 'beacon2', 'beacon4'),
	('beacon1', 'beacon3', 'beacon4'),
	('beacon2', 'beacon3', 'beacon4')
]

def cal_dis(rssi, tx):
	ratio = rssi *1.0/tx
	dis = 10 ** ((27.55-(20*math(log10(2400))+math.fabs(ratio)))/20.0)
	return dis

def cal_triangle_center(beacon1, beacon2, beacon3):
	x1, y1 = beacon_coordinates[beacon1]
	x2, y2 = beacon_coordinates[beacon2]
	x3, y3 = beacon_coordinates[beacon3]

	center_x = (x1+x2+x3)/3
	center_y = (y1+y2+y3)/3

	return center_x, center_y

url=""
datas={}
ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52']
module_info = [['0','0','0','0','0','0'],
			   ['0','0','0','0','0','0'],
			   ['0','0','0','0','0','0'],
			   ['0','0','0','0','0','0']]

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
	returnedList = ble_803.parse_events(sock, 10)
	print "----------"
	for beacon in returnedList:
		for comp_str in ground_module:
			# macad, dis print
			# if(beacon[0:14] == comp_str):
			# 	print(beacon)
			# 	sendData = beacon.split(',')
			# 	datas={'macAddress':sendData[0], 'distance':int(sendData[1])}

			# 	print(datas)
			# 	# # request to url
			# 	# response=requests.post(url, data=datas)

			# ex
			if(beacon[0:17]==comp_str):
				# ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
				sendData = beacon.split(',')
				print(sendData)
				ratio = float(sendData[5])*1.0/float(sendData[4])
				dis = 10**((27.55-(20*math.log10(2400))+math.fabs(ratio))/20.0)
				if(len(sendData)==6):
					sendData.append(dis)
				
				print sendData
				
				# print beacon
	time.sleep(5)