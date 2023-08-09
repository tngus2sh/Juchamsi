from flask import Flask, jsonify, request
import subprocess
import socket
import requests
import json
import RPi.GPIO as GPIO
from time import sleep
from flask_cors import CORS

servoPin = 12
SERVO_MAX_DUTY = 12
SERVO_MIN_DUTY = 3

GPIO.setmode(GPIO.BOARD)
GPIO.setup(servoPin, GPIO.OUT)

servo = GPIO.PWM(servoPin, 50)

ServerURL = "https://8ce6-121-178-98-21.ngrok-free.app"
def operate_servo():
    servo.start(0)
    setServoPos(0)
    sleep(1)
    setServoPos(90)
    sleep(1)
    setServoPos(50)
    sleep(1)
    setServoPos(120)
    sleep(1)
    setServoPos(180)
    sleep(1)
    servo.stop(0)


def setServoPos(degree):
    if degree > 180:
        degree = 180
    duty = SERVO_MIN_DUTY+(degree*(SERVO_MAX_DUTY-SERVO_MIN_DUTY)/180.0)
    print("Degree: {} to {}(Duty)".format(degree, duty))
    servo.ChangeDutyCycle(duty)

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # We use a dummy IP here, as we just want to initiate the connection to retrieve the local IP
    s.connect(("8.8.8.8", 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    print('hi')
    return 'Hello, World!'

@app.route('/open', methods=['GET'])
def open():
    # moduleName = request.args.get('key', default=None, type=str)
    # send ground mac add
    operate_servo()
    print(groundModule[1])
    return jsonify(success=True)
    
@app.route('/close', methods=['POST'])
def close():
    groundMacAddress = request.form.get('groundMacAddress')
    print("Received data:", groundMacAddress)
    return jsonify(success=True, groundMacAddress=groundMacAddress)

if __name__ == '__main__':
    app.debug = True
    groundModule = ['b0:a7:32:db:c8:46','cc:db:a7:69:74:4a','cc:db:a7:69:19:7a','b0:a7:32:db:c3:52']
    headers = {'Content-Type': 'application/json'}
    myIP = get_ip_address()
    datas = {'kioskIP': myIP}
    json_data = json.dumps(datas)
    # response = requests.post(exit_url, data=json_data, headers=headers)
    print("IP: ", myIP)
    app.run(host="0.0.0.0", port=80)