# test BLE Scanning software
# jcs 6/8/2014

import blescan_sendmadis
import sys
import requests
import bluetooth._bluetooth as bluez
import time
url=""
datas={}
ground_module = ['cc:db:a7:69:19']
dev_id = 0
try:
	sock = bluez.hci_open_dev(dev_id)
	print "ble thread started"

except:
	print "error accessing bluetooth device..."
    	sys.exit(1)

blescan_sendmadis.hci_le_set_scan_parameters(sock)
blescan_sendmadis.hci_enable_le_scan(sock)

while True:
	returnedList = blescan_sendmadis.parse_events(sock, 10)
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
			
			# all print
			# if(beacon[-5]=='0' and beacon[0:2]=='cc'):
			# 	sendData = beacon.split(',')
			# 	divToDiv = 10**((-30-float(sendData[-1]))/(50))
			# 	if(len(sendData)==6):
			# 		sendData.append(divToDiv)
				
			# 	print sendData
			# 	print beacon
			# ex
			if(beacon[0:2]=='cc'):
				sendData = beacon.split(',')
				divToDiv = 10**((-30-float(sendData[-1]))/(50))
				if(len(sendData)==6):
					sendData.append(divToDiv)
				
				# print sendData
				print beacon
	time.sleep(10)
