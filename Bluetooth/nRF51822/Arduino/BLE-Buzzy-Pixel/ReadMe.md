# Bluetooth Low Energy (BLE) Buzzy Pixel

BLE Buzzy Pixel Arduino sketch to read and set status and animations on NeoPixel strip

## Steps to run BLE-Buzzy-Pixel

* Install 1.0.5 RedBearLabs nRF51822 board using board manager: https://github.com/RedBearLab/nRF51822-Arduino#install-board-package-add-on.

* Go to Sketch -> Include Library -> Manage Libraries. Search for BLE Peripheral and install version 0.2.0

* Search for Adafruit NeoPixel library and install version 1.0.5. Installed library needs nRF51 board support to compile.
See https://github.com/adafruit/Adafruit_NeoPixel/pull/42

* Overwrite Adafruit_NeoPixel.cpp inside installed libraries at /Documents/Arduino/libraries/Adafruit_NeoPixel/ with [nRF51 Adafruit_Neopixel.cpp](https://github.com/mozilla/project_haiku.iot/tree/master/Bluetooth/nRF51822/Libraries/Adafruit_NeoPixel_nRF51/) file from here.

* Open BLE-Buzzy-Pixel.ino file. Update config.h with pin out and pixel count settings as per your circuit and upload the code to BLE Nano.

* If there are erros while uploading sketch using Arduino IDE, follow [instrcutions here](https://github.com/mozilla/project_haiku.iot/tree/master/Bluetooth/nRF51822/Arduino#arduino-upload-instructions-if-nothing-else-work) to copy latest bootloader.hex to BLE Nano board. 

* To test uploadeded sketch BLE-Buzzy-Pixel, use LightBlue iOS app or nRFCOnnect Android app to find BLE Nano peripheral device 'BLE-Buzzy-Pixel'  and select to connect. It should show  READ-WRITE and  READ-NOTIFY services. Select READ-WRITE service and click on Write new value and enter ‘00’ for turning NeoPixel off. Enter ‘01’ to turn NeoPixel on. You can see the output in serial monitor at baud rate 9600.
Click on READ-NOTIFY service and start listening to notifications. Button press should send 0x01 and turn NeoPixel on. Release of button should send 0x00 and turn NeoPixel off.

* To test uploaded sketch with BLE-Buzzy-Pixel Cordova app, install app on Android phone following [instructions here](https://github.com/mozilla/project_haiku.iot/tree/master/Bluetooth/nRF51822/PhoneGap/BLE-Buzzy-Pixel)

[Link to Video](http://youtu.be/B1qS--DboT4) showing BLE-Buzzy-Pixel Cordova app communicating with BLE Nano

### Bill Of Material - BLE-Buzzy-Pixel

*  BLE Nano & MK20 USB Board - http://redbearlab.com/blenano/
* [Optional] RedBearLab nRF51822 Pinout - http://redbearlab.com/redbearlab-nrf51822/ (Ideally BLE Nano should suffice, for beginners nRF51822 dev board is recommended instead of BLENano at first as it has easy pin out interface)
* "Neopixel" WS2812 addressable LED strip. Non-waterproof, 60 LEDs per meter. (cut strip of 5 LEDs per unit) [Amazon](https://www.amazon.com/Mokungit-Programmable-Individually-Addressable-Non-waterproof/dp/B01D1EDDR8?ie=UTF8&*Version*=1&*entries*=0)
* Sparkfun inventor kits part for resistor, buttons, led and jumper wires - [Sparkfun](https://www.sparkfun.com/products/13110)
* Breadboard - [Sparkfun](https://www.sparkfun.com/products/12002)

