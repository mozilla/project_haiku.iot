BLE server that broadcasts WiFi connect service on ARM linux device (BeagleBoneGreen Wireless).
Device can be configured and connect to WiFi by passing WiFi credential
using client app such as nRFConnect (Android).

## Setup BBGW

* [Follow steps](https://github.com/mozilla/project_haiku.iot/wiki/Boot--BeagleBone-Black-via-microSD-Card) to boot BBGW via microSD Card.
Used latest debian image bone-debian-8.6-lxqt-4gb-armhf-2016-11-06-4gb.img.xz 

* Connect BBGW to wifi using connmanctl, type connmanctl.

First turn tethering off for wifi! 

connmanctl> tether wifi off

Disabled tethering for wifi

You can then perform the rest of the connmanctl actions to set wifi:

connmanctl> scan wifi

Scan completed for wifi

connmanctl> services

TEST wifi_deadbeef0000_4b41595a4545505550_managed_psk

connmanctl> agent on

Agent registered

connmanctl> connect wifi_deadbeef0000_4b41595a4545505550_managed_psk

Agent RequestInput wifi_deadbeef0000_4b41595a4545505550_managed_psk

Passphrase = [ Type=psk, Requirement=mandatory, Alternates=[WPS ] ]

WPS = [ Type=wpspin, Requirement=alternate ]

Passphrase? WTGD3g3gk69lw

Connected wifi_deadbeef0000_4b41595a4545505550_managed_psk

connmanctl> quit

* Once its connected to WiFi, install and update packages. This takes 15-30 minutes

sudo apt-get update

sudo apt-get dist-upgrade

* Update node to latest version using below commands

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get install -y nodejs


## To run [bleno module](https://github.com/sandeepmistry/bleno) on debian

* Install all prerequisite from bleno github page for debian

sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

* Run sudo bb-wl18xx-bluetooth

This is built-in script for wireless-capable BeagleBone models
that discovers Bluetooth hardware and sets it up for use.

* Verify if bluetoothhd is running using command

pgrep bluetoothd

If yes disable the process by using below commands as it
interferes with the [bluetooth process](https://github.com/sandeepmistry/bleno#linux)

Disable /user/lib/bluetooth/bluetoothhd

deamon and shouldn’t appear in process list

ps -ef | grep blue

sudo kill -9 <pid>

## Run ConnectWiFi BLEService

npm install

node connect.js

## Bluetooth logs using hcidump

sudo apt-get install bluez-hcidump

sudo hcidump -t -x
