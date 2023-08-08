from flask import Flask
import socket
import requests

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

@app.route('/open')
def open():
    moduleName = request.args.get('key', default=None, type=str)
    return 'open'
    
@app.route('/close')
def close():
    return 'close'
if __name__ == '__main__':
    groundModule = ['','','','']
    app.debug = True
    myIP = get_ip_address()
    print("IP: ", myIP)
    app.run(host="0.0.0.0", port=80)