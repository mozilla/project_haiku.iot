# smarthome.iot / User Research #2 Prototype

This prototype will support of our next round of user research, in which we are investigating 1:1 communication with a simple physical device, built around the Particle "Photon" board.

### Overview

The device connects over Wifi to Particle's cloud service where "messages" are exchanged between an identical "paired" device held by a friend. The device has a single button, and clicking/double-clicking/long-clicking on one results in a different LED animation on the other.

### Bill of Materials

Vendor links are just a suggestion. You may want to adjust based on what you can get hold of locally, quantity etc. Our code is currently specific to the Photon board (but could be ported to other similar platforms.)

* Particle Photon *without headers* [Particle store](https://store.particle.io/)
* USB LiIon/LiPoly charger - [Adafruit](https://www.adafruit.com/products/259)
* "Neopixel" WS2812 addressable LED strip. Non-waterproof, 60 LEDs per meter. (cut strip of 5 LEDs per unit) [Amazon](http://www.amazon.com/Mokungit-Programmable-Individually-Addressable-Non-waterproof/dp/B01D1EDDR8)
* 3.7v 2000mAh Lithium Ion Battery [Adafruit](https://www.adafruit.com/products/2011) - note that shipping restrictions apply. Max 8 per order, no USPS delivery.
* 12x12x7mm Momentary Tactile Push Button Switch 4 Pin DIP [Amazon](http://www.amazon.com/uxcell%C2%AE-12x12x7mm-Momentary-Button-Switch/dp/B009ERT2NQ)
* 10K Ohm 1/4 watt resistor [Adafruit](https://www.adafruit.com/products/2784)
* Pancake vibration motor [Adafruit](https://www.adafruit.com/products/1201)
* Mini USB Cable - A to Mini B [Amazon](http://www.amazon.com/StarTech-com-Mini-USB-Cable-USB2HABM6RA/dp/B004NO0L4O)
* Hookup wire for all the connections. E.g. [Adafruit](https://www.adafruit.com/products/1311)

### Building the Prototype Device

#### 3D Printing the enclosure

The OpenSCAD source file and print-ready [enclosure.stl](assets/3d/enclosure.stl) are in the [Prototype/assets/3d](assets/3d) directory. We used white ABS with a normal "regular quality" print profile: 0.25mm layer height, 1mm shell, no brim or other supports.

#### Assembling the Electronics

Most parts are off the shelf. If creating the device on the breadboard you can simply wire it up with jumper wires. To fit into the enclosure, you will need to cut down a piece of strip board to 6 columns and ~14 rows. The videos below walk through wiring it all up and getting it into the enclosure.

* [Wiring diagram](assets/BlinkyButton_bb.png)
* [Walkthrough video 1/3](https://www.youtube.com/watch?v=C2MHg81-BwQ) - First stage of assembling the device, wiring up the Particle Photon board and the LiPo charging board2.
* [Walkthrough video 2/3](https://youtu.be/lktK18RHnlE) - Completing wiring
* [Walkthrough video 3/3](https://youtu.be/VAnI2gIuZO8) - Packing the enclosure


#### Software

##### Setup Your Photon

* To use Photon board, you need to setup your Photon. Particle provides plenty of options for registering your Photons with your local WiFi.  Recommended way to setup your photon is via Particle Mobile App, you'll have to create a particle account in order to manage your particle boards.
* If you prefer command line tools, you'll need to have node.js and particle-cli installed on your computer.
* Follow the quickstart instruction on photon website to create an particle account, connect your photon to wifi, and claim it under your account.
* Please note both the devices in a pair should be claimed under the same particle account.


##### Configure

Go to https://build.particle.io, and click on Create New App and name it ‘buzzy-pixel’ and hit save icon on left. This should create a new file buzzy-pixel.ino.

Click on Libraries button, and find BlingButton in Community Libraries. Select BlingButton library, and click on INCLUDE IN APP.

Go back to your created app ‘buzzy-pixel’, and paste following code inside the ino file.
https://github.com/mozilla/project_haiku.iot/blob/master/Prototype/InternetButton/buzzy-pixel/buzzy-pixel.ino

Note: With WebIDE after including BlingButton library in your app, update reference in above buzzy-pixel.ino code from
#include "BlingButton.h" -> #include "BlingButton/BlingButton.h"
#include "Page.h" -> #include "BlingButton/Page.h"

Add new file by clicking on ‘+’ on top right. Rename the file as ‘ButtonConfig.h’ [You can delete the corresponding cpp file created by default]

Paste the below config settings code in ButtonConfig.h
https://github.com/mozilla/project_haiku.iot/blob/master/Prototype/InternetButton/buzzy-pixel/ButtonConfig.h


###### Understanding ButtonConfig

ButtonConfig file settings are used to identify Device 1 and Device 2 in a pair.
* For Device 1  PUBLISH_EVENT_NAME  should be set as "DEVICE_1_BUTTON_PRESS" and SUBSCRIBE_EVENT_NAME should be "DEVICE_2_BUTTON_PRESS".
* For Device 2 in a pair PUBLISH_EVENT_NAME  should be set as "DEVICE_2_BUTTON_PRESS" and SUBSCRIBE_EVENT_NAME should be set as "DEVICE_1_BUTTON_PRESS.
* BATTERY_CHECK flag in config file is used to trigger battery level check code . It ensures device goes to sleep if battery level is below the BATTERY_THRESHOLD.
* BATTERY_CHECK_TIME flag sets the time interval after which you want to repeat battery level check.



##### Flash code

Make sure both your photon devices are connected and breathing cyan.  By default ButtonConfig is set for Device1, follow below steps to flash Device 1 in a pair.

* Click on Devices button in https://build.particle.io, and star the device you want to flash.
* Click Verify button, It should compile code in the cloud and you should get code verified message on bottom left
* Click Flash button, if it's blinking purple, and reboot to breathing cyan after a while, it should be working properly.

Update ButtonConfig.h (See Understanding ButtonConfig) for Device 2 and repeat above three steps for Device 2. After flashing, devices should be communicating and sending ambient messages to paired device.


##### Alternative: Flash with Command Line Tools

Login particle with your email and password if you haven't using command

* particle login.

Make sure you cd into the Prototype/InternetButton/buzzy-pixel directory, change the ButtonConfig.h in Prototype/InternetButton/buzzy-pixel/ButtonConfig.h and flash code with following command:

* particle flash {your_photon_name} ./*

If it's blinking purple, and reboot to breathing cyan after a while, it should be working. Change the ButtonConfig.h for Device 2 settings and flash Device 2.



### Operating Instructions

#### Connecting to WiFi

* Make sure your WiFi is turned on. If phone: Tap Home > Settings > WiFi on your phone. If computer: do tap WiFi icon on your computer to choose a WiFi network.

* Press SETUP button on your device for 3 seconds. This will put your device in Listening Mode and your device should begin blinking dark blue. When your device is in Listening Mode, it is waiting for you to connect it to WiFi.

* Go to Home > Settings > Wifi and change to the Photon-XXXX network.

* After connected to Photon-XXXX network, open browser and enter this URL http://192.168.0.1/index.html in a browser window.

* Click the Scan button. A list of WiFi networks will show.

* Press the option button for your home WiFi network.

* Enter your home WiFi password in the Password field. Then click Connect button. Your device should blink green to let you know it’s trying to connect to the internet. An alert will show with help instruction in case you entered wrong password. Press OK.

* Give your device a few seconds to connect and start blinking light blue. When it is blinking light blue, your device is happily connected to the Internet!

#### Reset to remove stored WiFi data from device
To wipe any stored WiFi credentials on the device, hold the MODE button for about ten seconds, until the RGB LED blinks blue rapidly.
