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
import pymongo

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

    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["invim"]
    mycol_sensors = mydb["sensorscollection"]

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
    enterLow = 160
    leaveHigh = 110
    leaveLow  = 90

    while True:

        myreading = adc.read_voltage(1) * 100
        
        if myreading < enterHigh and myreading > enterLow :

            for x in range(5):
                print("Sensor E reading %d: %d" % (x, myreading))
                sys.stdout.flush()
                time.sleep(0.2)
                myreading = adc.read_voltage(1) * 100

                if myreading > enterHigh or myreading < enterLow :
                    break
                if x == 4 :
                    print("visitor_enter")
                    sys.stdout.flush()
                    mysensor = { "time": datetime.datetime.utcnow(), "state": 1 }
                    x = mycol_sensors.insert_one(mysensor)
                    # print(x)
                    time.sleep(1.0)

        elif myreading < leaveHigh and myreading > leaveLow :

            for x in range(5):
                print("Sensor L reading %d: %d" % (x, myreading))
                sys.stdout.flush()
                time.sleep(0.2)
                myreading = adc.read_voltage(1) * 100

                if myreading > leaveHigh or myreading < leaveLow :
                    break
                if x == 4 :
                    print("visitor_leave")
                    sys.stdout.flush()
                    mysensor = { "time": datetime.datetime.utcnow(), "state": 0 }
                    x = mycol_sensors.insert_one(mysensor)
                    # print(x)
                    time.sleep(1.0)

        else:
            print("Random: %d" % myreading)

        sys.stdout.flush()
        time.sleep(0.2)

if __name__ == "__main__":
    main()
