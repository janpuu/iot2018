import time
import datetime
import sys
import random

def main():

    while True:

        # random number and print message to app.js
        myRandomInt = random.randint(90,301) 
        if myRandomInt < 300 and myRandomInt > 250 :
            print("visitor_enter")

        elif myRandomInt < 140 and myRandomInt > 90 :
            print("visitor_leave")

        else:
            print("Random: %d" % myRandomInt)

        sys.stdout.flush()
        
        # wait
        time.sleep(1.0)

if __name__ == "__main__":
    main()