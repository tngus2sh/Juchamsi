from flask import Flask, jsonify, request
from time import sleep
import ble_803
import sys
import subprocess
import socket
import requests
import bluetooth._bluetooth as bluez
import json
import uuid
import numpy as np
import serial
import time
import RPi.GPIO as GPIO
import threading


app = Flask(__name__)

def getMacAddress():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join(mac[i:i+2] for i in range(0,12,2))

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # We use a dummy IP here, as we just want to initiate the connection to retrieve the local IP
    s.connect(("8.8.8.8", 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address

eventStartTimes = {}
lastGetRequestTime = {}

@app.route('/')
def hello():
    global eventStartTimes, lastGetRequestTime
    macAddress = request.args.get('macAddress', None)
    if macAddress and macAddress in lastGetRequestTime:
        del lastGetRequestTime[macAddress]
    print('hi')
    return 'Hello, World!'

def scan_bluetooth():
    state = 0
    cnt = 0
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
        returnedList = ble_803.parse_events(sock, 10)
        print "----------"
        for beacon in returnedList:
            for comp_str in ground_module:
                if(beacon[0:17]==comp_str):
                    # ['mac', 'manuid', 'sonar', 'sonartime', 'tx', 'rssi', 'dis']
                    sendData = beacon.split(',')
                    print sendData[0], sendData[2]
                    mac = sendData[0]
                    if int(sendData[2]) < 30:
                        if mac not in eventStartTimes:
                            eventStartTimes[mac] = time.time()
                        elif time.time() -eventStartTimes[mac] > 100:
                            if mac not in lastGetRequestTime or lastGetRequestTime:
                                print("error")
                            del eventStartTimes[mac]
                            if mac in lastGetRequestTime:
                                del lastGetRequestTime
    
def runServer():
    app.run(debug=False, host="0.0.0.0", port=80)
if __name__ == '__main__':

    groundModule = ['b0:a7:32:db:c8:46','cc:db:a7:69:74:4a','cc:db:a7:69:19:7a','b0:a7:32:db:c3:52']
    # response = requests.post(exit_url, data=json_data, headers=headers)
    server_thread = threading.Thread(target=runServer)
    server_thread.start()
    scan_bluetooth()