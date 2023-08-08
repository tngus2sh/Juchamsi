from flask import Flask
import socket

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
    return 'Hello, World!'

@app.route('/open')
def open():
    return 'open'
    
@app.route('/close')
def close():
    return 'close'
if __name__ == '__main__':
        app.debug = True
        myIP = get_ip_address()
        print("IP: ", myIP)
        app.run(host="0.0.0.0", port=80)