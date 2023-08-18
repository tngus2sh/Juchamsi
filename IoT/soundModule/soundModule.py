from flask import Flask, jsonify, request
from bluepy.btle import Scanner, DefaultDelegate
import os
import threading
import RPi.GPIO as GPIO
import time

app = Flask(__name__)

groundModule = ['b0:a7:32:db:c8:46', 'cc:db:a7:69:74:4a', 'cc:db:a7:69:19:7a', 'b0:a7:32:db:c3:52']
signal_count = {key: 0 for key in groundModule}
no_signal_count = {key: 0 for key in groundModule}
post_received = {key: False for key in groundModule}
parked = [0, 0, 0, 0]

def play_isd1820_sound(play_e_pin=27):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(play_e_pin, GPIO.OUT)
    
    GPIO.output(play_e_pin, GPIO.HIGH)
    time.sleep(0.1)
    GPIO.output(play_e_pin, GPIO.LOW)
    
    GPIO.cleanup()

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if dev.addr in signal_count and parked[groundModule.index(dev.addr)] == 0:
            if isNewDev or isNewData:
                signal_count[dev.addr] += 1
                no_signal_count[dev.addr] = 0

                if signal_count[dev.addr] >= 30:
                    play_isd1820_sound()
                    signal_count[dev.addr] = 0
                    if post_received[dev.addr]:
                        post_received[dev.addr] = False
                else:
                    print(f"Device {dev.addr} count: {signal_count[dev.addr]}")

scanner = Scanner().withDelegate(ScanDelegate())

@app.route('/', methods=['POST'])
def report():
    data = request.json
    raspberry_mac = data.get('macAddress')
    module_mac = data.get('groundAddress')
    print(raspberry_mac, module_mac)

    if module_mac in signal_count and parked[groundModule.index(module_mac)] == 0:
        signal_count[module_mac] = 0
        post_received[module_mac] = True
        parked[groundModule.index(module_mac)] = 1  # Mark the module as parked.

    return jsonify({"status": "ok"})

def run_flask_app():
    app.run(host='0.0.0.0', port=80, debug=False)

def run_bluetooth_scan():
    while True:
        devices = scanner.scan(1)
        detected_addresses = [dev.addr for dev in devices]

        for addr in groundModule:
            if addr not in detected_addresses and parked[groundModule.index(addr)] == 0:  # Check if module is not parked.
                no_signal_count[addr] += 1
                
                if no_signal_count[addr] >= 10:
                    signal_count[addr] = 0
                    no_signal_count[addr] = 0

                    if post_received[addr]:
                        post_received[addr] = False
            else:
                no_signal_count[addr] = 0

def initialize_bluetooth():
    os.system('sudo hciconfig hci0 down')
    os.system('sudo hciconfig hci0 up')

if __name__ == '__main__':
    initialize_bluetooth()

    flask_thread = threading.Thread(target=run_flask_app)
    flask_thread.start()
    
    run_bluetooth_scan()