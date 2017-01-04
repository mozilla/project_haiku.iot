BLE server that broadcasts WiFi connect service on ARM linux device (BeagleBoneGreen Wireless).
Device can be configured and connect to WiFi by passing WiFi credential
using client app such as nRFConnect (Android).

## Setup BBGW

* [Follow steps](https://github.com/mozilla/project_haiku.iot/wiki/Boot--BeagleBone-Black-via-microSD-Card) to boot BBGW via microSD Card.
Used latest debian image bone-debian-8.6-lxqt-4gb-armhf-2016-11-06-4gb.img.xz 

* Connect BBGW to wifi using connmanctl, type connmanctl.

* First turn tethering off for wifi! 

    _connmanctl> tether wifi off_

    _Disabled tethering for wifi_

* You can then perform the rest of the connmanctl actions to set wifi:

    _connmanctl> scan wifi_

    _Scan completed for wifi_

    _connmanctl> services_

    _TEST wifi_deadbeef0000_4b41595a4545505550_managed_psk_

    _connmanctl> agent on_

    _Agent registered_

    _connmanctl> connect wifi_deadbeef0000_4b41595a4545505550_managed_psk_

    _Agent RequestInput wifi_deadbeef0000_4b41595a4545505550_managed_psk_

    _Passphrase = [ Type=psk, Requirement=mandatory, Alternates=[WPS ] ]_

    _WPS = [ Type=wpspin, Requirement=alternate ]_

    _Passphrase? WTGD3g3gk69lw_

    _Connected wifi_deadbeef0000_4b41595a4545505550_managed_psk_

    _connmanctl> quit_

* Once its connected to WiFi, install and update packages. This takes 15-30 minutes

    _sudo apt-get update_

    _sudo apt-get dist-upgrade_

* Update node to latest version using below commands

    _curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -_

    _sudo apt-get install -y nodejs_


## To run [bleno module](https://github.com/sandeepmistry/bleno) on debian

* Install all prerequisite from bleno github page for debian

    _sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev_

* Run _sudo bb-wl18xx-bluetooth_

    This is built-in script for wireless-capable BeagleBone models
that discovers Bluetooth hardware and sets it up for use.

* Verify if bluetoothhd is running using command

    _pgrep bluetoothd_

    If yes disable the process by using below commands as it
interferes with the [bluetooth process](https://github.com/sandeepmistry/bleno#linux). /user/lib/bluetooth/bluetoothhd deamon shouldn’t appear in process list

    _ps -ef | grep blue_

    _sudo kill -9 <pid>_

## Disconnect WiFi 
* If BBGW is previously connected to WiFi, one can remove stored network name and passphrase by editing file  /var/lib/connman/*/settings
* Reboot BBGW to disconnect from previously connected WiFi


## Run ConnectWiFi BLEService

    npm install

    npm install async@0.6.0 // To fix async.retry error thrown by connman-simplified node package

    node connect.js

## Bluetooth logs using hcidump

    sudo apt-get install bluez-hcidump

    sudo hcidump -t -x
