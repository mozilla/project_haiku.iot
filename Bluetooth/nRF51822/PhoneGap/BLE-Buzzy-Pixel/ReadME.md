# Cordova Android app BluetoothLE Buzzy Pixel

Cordova app communicating with NeoPixel using BLE

## Steps to run BluetoothLE Buzzy Pixel Android app

Follow below commands to create cordova Android app. [Link with detail commands](https://cordova.apache.org/docs/en/latest/guide/cli/) 

* sudo npm install -g cordova
* install android studio which brings in android sdk http://developer.android.com/sdk/installing/index.html?pkg=studio
* cd BLE-Buzzy-Pixel/
* cordova platform add android
* cordova plugin add cordova-plugin-bluetoothle@3.1.0 [Tested with 3.1.0]
* cordova plugin add <path to local cordova-plugin-fetch directory [../cordove-plugin-fetch]>
* cordova build
* connect android device to your machine, then to run app type: cordova run android

## Useful links
* https://cordova.apache.org/docs/en/latest/guide/cli/
* https://github.com/don/cordova-plugin-ble-central
* https://www.uuidgenerator.net/
* To remove a plugin cordova plugin remove <plugin-name>
* To view plgin installed - cordova plugin list


## Android version < 6.0
For version below Android 6, App need to support cordova-plugin-bluetoothle version 2.4.0 or below - TBD