'use strict';

var bleno = require('bleno');
var characteristics = require('./characteristics');

var name = 'Haiku';
var serviceUUIDs = ['fffffffffffffffffffffffffffffff1']

// ble primary service
var primaryService = new bleno.PrimaryService({
    uuid: serviceUUIDs[0], // or 'fff0' for 16-bit
    characteristics: [
      new characteristics.SSIDCharacteristic(),
      new characteristics.PwdCharacteristic()
    ]
});

bleno.on('stateChange', function(state){
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    //Start advertising when bleno.state is powered on 
    bleno.startAdvertising(name, serviceUUIDs);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    var services = [primaryService];
    // Set the primary services available on the peripheral.
    bleno.setServices(services);
  }
});
