import RPi.GPIO as GPIO
import time
from flask import Flask, jsonify, request
import ble_803
import sys
import socket
import requests
import bluetooth._bluetooth as bluez
import uuid
import time
import threading


REC = 17
PLAYE = 27
PLAYL = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup(REC, GPIO.OUT)
GPIO.setup(PLAYE, GPIO.OUT)
GPIO.setup(PLAYL, GPIO.OUT)


GPIO.output(REC, GPIO.HIGH)
GPIO.output(PLAYE, GPIO.HIGH)
GPIO.output(PLAYL, GPIO.HIGH)


def play_message():
    print("Playing message...")
    GPIO.output(PLAYE, GPIO.LOW)
    time.sleep(0.1)  # 버튼 누르기
    GPIO.output(PLAYE, GPIO.HIGH)


IMEOUT_INTERVAL = 10  # Signal timeout in seconds. Adjust as needed.

lastSignalTime = {}

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
    ground_module = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a','cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52']
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
                    lastSignalTime[mac] = time.time()

                    if int(sendData[2]) < 30:
                        print(signalCounts)
                        if mac not in eventStartTimes:
                            eventStartTimes[mac] = time.time()
                            signalCounts[mac] = 1
                        else:
                            signalCounts[mac] += 1
                            if signalCounts[mac] == 100:
                                if mac not in lastGetRequestTime:
                                    play_message()
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
        current_time = time.time()
        for mac in list(signalCounts.keys()):
            if (current_time - lastSignalTime[mac]) > TIMEOUT_INTERVAL:
                signalCounts[mac] = 0

def runServer():
    app.run(debug=False, host="0.0.0.0", port=80)

if __name__ == '__main__':
    server_thread = threading.Thread(target=runServer)
    server_thread.start()
    scan_bluetooth()