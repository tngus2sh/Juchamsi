#!/usr/bin/env python3
import serial
import time
import CHECKFREQ
if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
    ser.flush
    while True:
        if ser.in_waiting>0:
            line = ser.readline().decode('utf-8').rstrip()
            parts = line.split(": ")
            if len(parts)>=2:
                change_value = float(parts[1])
                time.sleep(1)
                print(line)
                print(change_value)
            # car move
            if change_value > 15:
                print 'plus 15'
                CHECKFREQ.scan_bluetooth()
                # need to send move signal
            # car stop
            else:
                # need to search bluetooth
                print 'stop'
                pass