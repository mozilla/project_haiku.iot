# Cordova Android app BLE-Buzzy-Pixel

Cordova app communicating with NeoPixel using BLE

## Steps to run BLE-Buzzy-Pixel Android app

Follow below commands to create cordova Android app. [Link with detail commands](https://cordova.apache.org/docs/en/latest/guide/cli/) 

* mkdir phonegap
* sudo npm install -g cordova
* cd phonegap/

* do the following to create skeleton of app for android

* cordova create BLE-Buzzy-Pixel com.example.blebuzzypixel BLE-Buzzy-Pixel
* cordova platform add android
* cd BLE-Buzzy-Pixel/
* cordova platform add android
* cordova plugin add cordova-plugin-ble-central
* cordova platforms ls

* install android studio which brings in android sdk http://developer.android.com/sdk/installing/index.html?pkg=studio
* cordova build
* connect android device to your machine, then to run app type: cordova run android

## Useful links
* https://cordova.apache.org/docs/en/latest/guide/cli/
* https://github.com/don/cordova-plugin-ble-central
* https://www.uuidgenerator.net/
