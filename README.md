# INVIM
## INtelligent VIsitor Monitor
Measuring visitors going in and out of a building. Adjusting equipment based on people inside.

![Alt text](/Screenshots/invim_screenshot_small.png "INVIM Screenshot")

Practice assignment for IoT course / Opiframe, Jyväskylä 2018-2019

### Main features
* Show number of people inside of a building and visitors today/yesterday
* Turning lights and ventilation on/off (images/animated gif) depending on number of people inside.
* Bar graph of people inside

### Hardware
* Raspberry Pi 3+
* Windows PC (development/testing)

### Sensors and equipment for Raspberry Pi
* [ADC Pi Plus](https://www.abelectronics.co.uk/p/56/adc-pi-plus-raspberry-pi-analogue-to-digital-converter) (Analog to digital converter)
* [Sharp GP2Y0A02YK0F](https://www.sparkfun.com/datasheets/Sensors/Infrared/gp2y0a02yk_e.pdf) (IR distance sensor for 20-150 cm)
* Two Color LED (Red/Green) [#15](https://www.instructables.com/id/Arduino-37-in-1-Sensors-Kit-Explained/)
* Active buzzer [#26](https://www.instructables.com/id/Arduino-37-in-1-Sensors-Kit-Explained/)

### Backend
* Raspbian GNU/Linux 9
* MongoDB
* Node.js
* Express.js
* JavaScript
* Python (+pymongo)
* pyshell

### Frontend
* Slightly modified HTML template by:
    Ion by TEMPLATED * templated.co @templatedco. Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
* ReactJS
* JavaScript
* axios
* bootstrap
* react-chartjs-2

### Basic Function

* In Raspberry Pi mode everything works inside Raspberry Pi (MongoDB, NodeJS, Python, React) + sensor/leds/buzzer
* In Windows mode everything works inside Windows PC but sensor readings are faked and without audiovisual gratification.

**Use selectedPythonScript variable in backend/app.js to adjust desirable outcome**

    let selectedPythonScript = 10;
    
    10-19 Windows
    10 = Windows (random visitors) -* NORMAL setting for testing in Windows
    11 = Windows (no direct DB posts from Python)
    12 = Windows (no enter/leaving messages from Python)
    20-29 Raspberry Pi
    20 = Raspberry (includes direct DB posts from Python)
    21 = Raspberry (no direct DB posts from Python) -* NORMAL setting for testing in Raspberry
    22 = Raspberry real gate test -* NORMAL setting for real life gate operation

#### Backend
* Main program in NodeJS runs a Python script.
* Python script reads input from IR distance sensor.
* Python script will send some raw sensor data to MongoDB (Win works fine, Raspberry Pi needs some work with Python/MongoDB versions).
* Python script will send messages back to NodeJS if requirements are met for people coming in or going out.
* NodeJS handles those messages and makes database posts accordingly.

#### Frontend
* Main program runs in NodeJS with React.
* Main display consists from two parts: Chart and rest of the page. Both are currently updated at 5 sec interval.
* REST API is used with backend to retreive information from database and shown in page.

#### Other
* Green led is flashed if person is coming in.
* Red led is flashed if person is going out.
* Warning buzzer is sound if person stands too long in front of the distance sensor.

### Team
* Faraz Khan
* Janne Puuronen
* Juhani Sams
* Jarmo Siira