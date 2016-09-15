# Cordova Android app BluetoothLE Buzzy Pixel

Cordova app communicating with NeoPixel using BLE

## Steps to run BluetoothLE Buzzy Pixel Android app

Follow below commands to create cordova Android app. [Link with command details](https://cordova.apache.org/docs/en/latest/guide/cli/)

* sudo npm install -g cordova
* install android studio which brings in android sdk http://developer.android.com/sdk/installing/index.html?pkg=studio

* cd BLE-Buzzy-Pixel/
* cordova platform add android
* To check if you satisfy requirements for building the platform use command - cordova requirements
* cordova plugin add cordova-plugin-bluetoothle@3.1.0 - [Tested with 3.1.0]
* cordova plugin add path to local cordova-plugin-fetch directory [../Plugins/cordove-plugin-fetch]
* Update [config settings here](https://github.com/mozilla/project_haiku.iot/blob/master/Bluetooth/nRF51822/PhoneGap/BLE-Buzzy-Pixel/www/js/config.js). Read below for more details about variables defined inside config.js.
* Status Service is link to cloud service to read and update status and messages. If you have the URL to cloud service, update config or read below for starting status API service on your local machine.
* cordova build
* connect android device to your machine, then to run app use command- cordova run android

## Config.js
* selfLED is the neopixel assigned to display status of the  BLE device. This value should be same as SELF_LED defined in the [BLENano sketch config](https://github.com/mozilla/project_haiku.iot/blob/master/Bluetooth/nRF51822/Arduino/BLE-Buzzy-Pixel/config.h#L15)
* baseURL is the address where cloudservice is running
* selfURL is the path '/user/[selfLED]/status' to get client status from cloud service
* ledLength is number of leds on the BLE device
* statusItems is array of relative path to retrieve status of all leds on the BLE device

## Status API Service
* To run status API service on your local, get code from repo https://github.com/mozilla/project_haiku_status_api.iot/tree/exp4-noslots
* Run npm start to start service at port 3000
* Open test client http://localhost:3000/example.html to view and change client 0 status. Click on start button to start polling. Click on first LED toggles status from 1 to 0 (green to red).

## Useful links
* https://cordova.apache.org/docs/en/latest/guide/cli/
* https://github.com/randdusing/cordova-plugin-bluetoothle
* https://www.uuidgenerator.net/
* To remove a plugin cordova plugin remove <plugin-name>
* To view plugin installed - cordova plugin list


## Android version < 6.0

cordova-plugin-bluetoothle 3.1.0 and above needs Andoid API > 23 that comes with Android 6.0 and above.

For version below Android 6, App need to support cordova-plugin-bluetoothle version 2.4.0 or below - TBD
