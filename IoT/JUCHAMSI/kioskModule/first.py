from flask import Flask, jsonify
import subprocess
import socket
import requests
import json
ServerURL = "https://8ce6-121-178-98-21.ngrok-free.app"
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # We use a dummy IP here, as we just want to initiate the connection to retrieve the local IP
    s.connect(("8.8.8.8", 80))
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address

app = Flask(__name__)

@app.route('/')
def hello():
    print('hi')
    return 'Hello, World!'

@app.route('/open', methods=['GET'])
def open():
    # moduleName = request.args.get('key', default=None, type=str)
    # send ground mac add
    print(groundModule[1])
    return jsonify(success=True)
    
@app.route('/close', methods=['GET'])
def close():
    return jsonify(success=True)

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