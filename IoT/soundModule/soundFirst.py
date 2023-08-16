import RPi.GPIO as GPIO
import time

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

try:
    print("Recording...")
    GPIO.output(REC, GPIO.LOW)
    time.sleep(5)
    GPIO.output(REC, GPIO.HIGH)
    print("Recording stopped")

    print("Playing once...")
    GPIO.output(PLAYE, GPIO.LOW)
    time.sleep(0.1)
    GPIO.output(PLAYE, GPIO.HIGH)
    time.sleep(5)

    print("Playing in loop...")
    GPIO.output(PLAYL, GPIO.LOW)
    time.sleep(0.1)
    GPIO.output(PLAYL, GPIO.HIGH)
    time.sleep(10)

    GPIO.output(PLAYL, GPIO.LOW)
    time.sleep(0.1)
    GPIO.output(PLAYL, GPIO.HIGH)

finally:
    GPIO.cleanup()