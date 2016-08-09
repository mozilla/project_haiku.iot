# Bluetooth Low Energy (BLE) technology

Arduino sketches to flash on RedBear Labs nRF51822 or BLE Nano board. Install Lightblue iOS app or the Android App - B-BLE to scan and debug BLE peripheral devices


## Steps to run BLE_UART_LED

* Follow Get Started steps using link below and Install latest 1.0.6 RedBearLabs nRF51822 board using board manager: https://github.com/RedBearLab/nRF51822-Arduino#install-board-package-add-on

* To upload the code on BLE Nano or nRF51822 dev board there are two options
* Option 1: Use Arduino IDE to compile and upload the code on the respective boards

* Option 2: The bootloader allows you to load firmware Over-the-air, for example, if you do not have the MK20 USB interface dongle.
 https://github.com/RedBearLab/nRF51822-Arduino#ota

a) Export Compiled library using Menu -> Sketch -> Export Compiled Binary


b) Install Nordic "nRF Toolbox” App on your smart phone and use it to open compiled library sent to your phone using air drop. Select file type "application" and select a device (you should see DFU_S130_V1.0 or RGB [device local name set in the sketch] in the device list) , On iOS, select firmware by navigating to User -> Inbox -> select firmware hex file and than click Upload


c) The firmware should upload and should show progress bar of file getting uploaded with the success message if file uploads successfully.


* To run BLE_UART_LED, use LightBlue app to find BLE Nano peripheral ‘RGB’ and select to connect. It should show two services click on write. Select Write new value and enter ‘000000’ for turning LED off. Enter ‘010203’ or any number other than 0 to turn LED on. The lED is attached to pin 13, on BLE Nano its next to 'RedBearLab' text on the board.  You can see the output in serial monitor at baud rate 9600.  

### Arduino Upload Instructions if nothing else work:
For uploading Arduino sketches your board should be preloaded with boot loader.hex. Ideally the above steps should work without explicit manual copy of the bootloader.hex.

In case you are getting error uploading Arduino file on the board, you can try copying bootloader.hex to /MBED
https://github.com/RedBearLab/nRF51822-Arduino#burn-bootloader

For Mac, I had to copy using Terminal  cp -vX bootloader.hex /Volumes/MBED/

## Steps to run BLE-Peripheral-SPI-LED

* Install 1.0.5 RedBearLabs nRF51822 board using board manager: https://github.com/RedBearLab/nRF51822-Arduino#install-board-package-add-on . There is an issue because of which code doesn't compile using latest 1.0.6 board. See https://github.com/sandeepmistry/arduino-BLEPeripheral/issues/70

* Open BLE-Peripheral-SPI-LED.ino file and upload the code to the respective board

* To run  BLE-Peripheral-SPI-LED, use LightBlue app to find BLE Nano peripheral ‘Arduino’ or 'LED' and select to connect. It should show one READWRITE service. Select Write new value and enter ‘00’ for turning LED off. Enter ‘01’ or any number other than 00 to turn LED on. You can see the output in serial monitor at baud rate 9600.  


### OTA Application upload

* Click Sketch -> Export Compiled Library. This will compile and create hex file in the same folder as respective ino file

* Send the hex file using Airdrop to SmartPhone and use nRFToolBox app to open the hex file

* Select the file in the app and the device to upload file to. Press reset button on the board and click upload in the app. Everytime, if you reset the board by hitting the button on the board, the bootloader will broacast the OTA service via BLE for 5 sec waiting for a connection to be made. Otherwise, it will start the pre-loaded firmware.

[Link to Video](http://youtu.be/w5vUd6isJYQ) to update RBL nRF51822 OTA and and run BLE-Peripheral-SPI-LED


## Steps to run BLE-Peripheral-NeoPixel

* Install 1.0.5 RedBearLabs nRF51822 board using board manager: https://github.com/RedBearLab/nRF51822-Arduino#install-board-package-add-on.

* Go to Sketch -> Include Library -> Manage Libraries. Search for Adafruit NeoPixel and install latest version 1.0.5. Installed library needs nRF51 board support to compile.
See https://github.com/adafruit/Adafruit_NeoPixel/pull/42

* Overwrite Adafruit_NeoPixel.cpp inside installed libraries at /Documents/Arduino/libraries/Adafruit_NeoPixel/ with [nRF51 Adafruit_Neopixel.cpp](https://github.com/mozilla/project_haiku.iot/tree/master/Bluetooth/nRF51822/Libraries/Adafruit_NeoPixel_nRF51/) file from here.

* Open BLE-Peripheral-NeoPixel.ino file and upload the code to the respective board.

* To run  BLE-Peripheral-SPI-LED, use LightBlue app to find BLE Nano peripheral device ‘Arduino’  and select to connect. It should show  READ-WRITE and  READ-NOTIFY services. Select READ-WRITE service and click on Write new value and enter ‘00’ for turning NeoPixel off. Enter ‘01’ or any number other than 00 to turn NeoPixel on. You can see the output in serial monitor at baud rate 9600.  Click on READ-NOTIFY service and start listening to notifications. Button press should send 0x01 and turn NeoPixel on. Release of button should send 0x00 and turn NeoPixel off.

[Link to Video](http://youtu.be/LVIa5FvAGQE) to run BLE-Peripheral-NeoPixel on BLE Nano

### Bill Of Material - BLE-Peripheral-NeoPixel

*  BLE Nano & MK20 USB Board - http://redbearlab.com/blenano/
* [Optional] RedBearLab nRF51822 Pinout - http://redbearlab.com/redbearlab-nrf51822/ (Ideally BLE Nano should suffice, for beginners nRF51822 dev board is recommended instead of BLENano at first as it has easy pin out interface)
* "Neopixel" WS2812 addressable LED strip. Non-waterproof, 60 LEDs per meter. (cut strip of 5 LEDs per unit) [Amazon](https://www.amazon.com/Mokungit-Programmable-Individually-Addressable-Non-waterproof/dp/B01D1EDDR8?ie=UTF8&*Version*=1&*entries*=0)
* Sparkfun inventor kits part for resistor, buttons, led and jumper wires - [Sparkfun](https://www.sparkfun.com/products/13110)
* Breadboard - [Sparkfun](https://www.sparkfun.com/products/12002)
