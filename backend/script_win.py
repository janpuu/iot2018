import time
import datetime
import sys
import random
import pymongo

def main():

    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["invim"]
    mycol_sensors = mydb["sensorscollection"]

    while True:
        # random number and print message to app.js
        myRandomInt = random.randint(90,301) 
        if myRandomInt < 300 and myRandomInt > 250 :
            print("visitor_enter")
            mysensor = { "time": datetime.datetime.utcnow(), "sensorid": 1, "state": 1 }
            x = mycol_sensors.insert_one(mysensor)
            # print(x)

        elif myRandomInt < 140 and myRandomInt > 90 :
            print("visitor_leave")
            mysensor = { "time": datetime.datetime.utcnow(), "sensorid": 1, "state": 0 }
            x = mycol_sensors.insert_one(mysensor)
            # print(x)
        else:
            print("Random: %d" % myRandomInt)

        sys.stdout.flush()
        
        # wait
        time.sleep(1.0)

if __name__ == "__main__":
    main()
