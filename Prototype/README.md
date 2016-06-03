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


### Connecting to WiFi

* Make sure your WiFi is turned on. If phone: Tap Home > Settings > WiFi on your phone. If computer: do tap WiFi icon on your computer to choose a WiFi network.

* Press SETUP button on your device for 3 seconds. This will put your device in Listening Mode and your device should begin blinking dark blue. When your device is in Listening Mode, it is waiting for you to connect it to WiFi.

* Go to Home > Settings > Wifi and change to the Photon-XXXX network.

* After connected to Photon-XXXX network, open browser and enter this URL http://192.168.0.1/index.html in a browser window.

* Click the Scan button. A list of WiFi networks will show.

* Press the option button for your home WiFi network.

* Enter your home WiFi password in the Password field. Then click Connect button. Your device should blink green to let you know it’s trying to connect to the internet. An alert will show with help instruction in case you entered wrong password. Press OK.

* Give your device a few seconds to connect and start blinking light blue. When it is blinking light blue, your device is happily connected to the Internet!

### Operating Instructions

#### Reset to remove stored WiFi data from device
To wipe any stored WiFi credentials on the device, hold the MODE button for about ten seconds, until the RGB LED blinks blue rapidly.
