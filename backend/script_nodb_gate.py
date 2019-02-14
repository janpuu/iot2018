#!/usr/bin/env python

"""
================================================
ABElectronics ADC Pi 8-Channel ADC
Requires python smbus to be installed
================================================

Initialise the ADC device using the default addresses and sample rate,
change this value if you have changed the address selection jumpers

Sample rate can be 12,14, 16 or 18
"""

from __future__ import absolute_import, division, print_function, \
                                                    unicode_literals
import time
import os
import RPi.GPIO as GPIO
# import pymongo

try:
    from ADCPi import ADCPi
except ImportError:
    print("Failed to import ADCPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append('..')
        from ADCPi import ADCPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")


def main():

    adc = ADCPi(0x68, 0x69, 12)

    """
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["invim"]
    mycol_sensors = mydb["sensorscollection"]
    """

#   Distance sensor voltage measurements with different distances
#	mm	voltage
#	150	2.80
#	200	2.48
#	250	2.20
#	300	1.93
#	350	1.67
#	400	1.48
#	450	1.30
#	500	1.19
#	550	1.09
#	600	1.00
#	650	0.94
#	700	0.90

    enterHigh = 300
    enterLow = 85
    leaveHigh = 60
    leaveLow  = 35

    # Slow measurement values for testing
    # sensorSleep = 0.2 # Time in seconds between sensor readings
    # waitTime = 100  # 25 sec

    # Production measurement values
    sensorSleep = 0.05 # Time in seconds between sensor readings
    waitTime = 100  # For loop wait time (waitTime * sensorSleep seconds) --> 5 sec

    GledGPIO = 18 # GPIO channel number for green led
    RledGPIO = 21 # GPIO channel number for red led

    GPIO.setmode(GPIO.BCM) # Use GPIO channel number (not board pin numbers, GPIO.BOARD)
    GPIO.setwarnings(False)

    GPIO.setup(GledGPIO,GPIO.OUT) # Output for green led GPIO channel number
    GPIO.setup(RledGPIO,GPIO.OUT) # Output for red led GPIO channel number

    while True:

        myreading = adc.read_voltage(1) * 100
        
            ##########
            ### ENTER
            ##########

        if myreading < enterHigh and myreading > enterLow :
            print("Sensor data: %d" % myreading)
            sys.stdout.flush()

            for x in range(waitTime) :
                myreading = adc.read_voltage(1) * 100
                time.sleep(sensorSleep)

                if myreading > enterHigh or myreading < enterLow :
                    print("ENTER break - x: %d sensor: %d" % (x, myreading))
                    sys.stdout.flush()

                    # Sensor requires some time to adjust
                    if x > 1 :
                        GPIO.output(GledGPIO,GPIO.HIGH)
                        print("visitor_enter")
                        sys.stdout.flush()
                        time.sleep(sensorSleep)
                        GPIO.output(GledGPIO,GPIO.LOW)

                    break
            else :
                # Someone is standing in front of sensor for too long, play alarm sound
                # print("ENTER else: %d" % myreading)
                # sys.stdout.flush()
                time.sleep(sensorSleep)
                os.system("./script_os_alarm.py")
                    
            """
            mysensor = { "time": datetime.datetime.utcnow(), "state": 1 }
            x = mycol_sensors.insert_one(mysensor)
            """

            ##########
            ### LEAVE
            ##########

        elif myreading < leaveHigh and myreading > leaveLow :
            print("Sensor data: %d" % myreading)
            sys.stdout.flush()

            for x in range(waitTime) :
                myreading = adc.read_voltage(1) * 100
                time.sleep(sensorSleep)

                if myreading > leaveHigh or myreading < leaveLow :
                    print("LEAVE break - x: %d sensor: %d" % (x, myreading))
                    sys.stdout.flush()

                    # Sensor requires some time to adjust
                    if x > 1 :
                        GPIO.output(RledGPIO,GPIO.HIGH)
                        print("visitor_leave")
                        sys.stdout.flush()
                        time.sleep(sensorSleep)
                        GPIO.output(RledGPIO,GPIO.LOW)

                    break
            
            else :
                # Someone is standing in front of sensor for too long, play alarm sound
                # print("LEAVE else: %d" % myreading)
                # sys.stdout.flush()                
                time.sleep(sensorSleep)
                os.system("./script_os_alarm.py")
 
            """
            mysensor = { "time": datetime.datetime.utcnow(), "state": 0 }
            x = mycol_sensors.insert_one(mysensor)
            """
        
        elif myreading < enterLow and myreading > leaveHigh :
            print("Middle zone: %d" % myreading)
            sys.stdout.flush()
            time.sleep(sensorSleep)

        else:
            # print("Random: %d" % myreading)
            # sys.stdout.flush()
            time.sleep(sensorSleep)

if __name__ == "__main__":
    main()
