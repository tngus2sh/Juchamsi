from flask import Flask, jsonify, request
import ble_803
import sys
import socket
import requests
import bluetooth._bluetooth as bluez
import uuid
import time
import threading

app = Flask(__name__)

def getMacAddress():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    return ':'.join(mac[i:i+2] for i in range(0,12,2))

eventStartTimes = {}
signalCounts = {}
lastGetRequestTime = {}

@app.route('/', methods=['POST'])
def hello():
    global lastGetRequestTime
    macAddress = request.args.get('macAddress', None)
    if macAddress and macAddress in lastGetRequestTime:
        del lastGetRequestTime[macAddress]
    print('hi@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    return 'Hello, World!'

def scan_bluetooth():
    ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52', '40:91:51:fc:fd:6a']
    dev_id = 0
    try:
        sock = bluez.hci_open_dev(dev_id)
        print("ble thread started")
    except:
        print("error accessing bluetooth device...")
        sys.exit(1)

    ble_803.hci_le_set_scan_parameters(sock)
    ble_803.hci_enable_le_scan(sock)

    while True:
        time.sleep(1)
        returnedList = ble_803.parse_events(sock, 10)
        for beacon in returnedList:
            for comp_str in ground_module:
                if(beacon[0:17]==comp_str):
                    sendData = beacon.split(',')
                    # print(sendData[0], sendData[2])
                    mac = sendData[0]
                    if int(sendData[2]) < 30:
                        print(signalCounts)
                        if mac not in eventStartTimes:
                            eventStartTimes[mac] = time.time()
                            signalCounts[mac] = 1
                        else:
                            signalCounts[mac] += 1
                            if signalCounts[mac] == 100:
                                if mac not in lastGetRequestTime:
                                    print("error")
                                del eventStartTimes[mac]
                                del signalCounts[mac]
                                if mac in lastGetRequestTime:
                                    del lastGetRequestTime[mac]
                    else:
                        print("clear")
                        if mac in eventStartTimes:
                            del eventStartTimes[mac]
                        if mac in signalCounts:
                            del signalCounts[mac]
                        if mac in lastGetRequestTime:
                            del lastGetRequestTime[mac]


def runServer():
    app.run(debug=False, host="0.0.0.0", port=80)

if __name__ == '__main__':
    server_thread = threading.Thread(target=runServer)
    server_thread.start()
    scan_bluetooth()