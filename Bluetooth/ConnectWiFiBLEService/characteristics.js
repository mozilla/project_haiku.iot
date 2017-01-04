'use strict';

var characteristics = function() {

var bleno = require('bleno');
var util = require('util');
var Connman = require('connman-simplified');

var SSID = null;
var Pwd = null;

var BlenoCharacteristic = bleno.Characteristic;

var WiFiSSIDCharacteristic = function() {
  WiFiSSIDCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff2', // or 'fff2' for 16-bit
    properties: ['read','write'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    value: null, // optional static value, must be of type Buffer - for read only characteristics
    descriptors: [
      new bleno.Descriptor({
		    uuid: '2901',
		    value: 'WiFi SSID'
	    })
    ]
  });

  this._value = new Buffer(0);
};

util.inherits(WiFiSSIDCharacteristic, BlenoCharacteristic);

// Define read request handler with parameters offset and callback 
// offset (0x0000 - 0xffff)
// callback must be called with resultcode e.g. Characteristic.RESULT_SUCCESS and data (of type Buffer)
WiFiSSIDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('WiFiSSIDCharacteristic - onReadRequest: value = ' + this._value.toString('utf8'));

  callback(this.RESULT_SUCCESS, this._value);
};

// Define write request handler with parameters data, offset, withoutResponse, callback
// data of type Buffer
// offset (0x0000 - 0xffff)
// withoutResponse (true | false)
// callback must be called with result code

WiFiSSIDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  SSID = this._value.toString('utf8');

  console.log('WiFiSSIDCharacteristic - onWriteRequest: value = ' + SSID);
  callback(this.RESULT_SUCCESS);
};


var WiFiPwdCharacteristic = function() {
  WiFiPwdCharacteristic.super_.call(this, {
    uuid: 'fffffffffffffffffffffffffffffff3', // or 'fff2' for 16-bit
    properties: ['read','write'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
    value: null, // optional static value, must be of type Buffer - for read only characteristics
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'WiFi Pwd'
      })
    ]
  });

  this._value = new Buffer(0);
  this._updateValueCallback =  connectWiFi;
};

var connectWiFi = function(pwd) {

  // Set up WiFi using Wifi credentials
  console.log('Setup WiFi with SSID= ' + SSID + ' and Pwd= ' + Pwd);
  var connman = Connman();
  connman.init(function(err) {
    connman.initWiFi(function(err,wifi,properties) {
      if(err) {
        console.log('Error:', err);
      }

      if(!properties.connected) { // not yet connected?
        wifi.getNetworks(function(err,list) {
          // get more readable list using getServicesString:
          console.log("networks: ", wifi.getServicesString(list));
          wifi.disconnect();
          // Throwing async.retry error fix, update async module to 0.6.0
          setTimeout(function() {
            wifi.join(SSID, Pwd);
          }, 5000);
        });
      }

      wifi.on('state',function(value) {
        console.log("WiFi state change: ",value);
        if (value === Connman.WiFi.STATES.FAILURE) {
           // Revisit retry logic
           console.log("Retry Wifi Connect");
           /* setTimeout(function() {
              wifi.disconnect();
              wifi.join(SSID, Pwd);
            },10000); */
        }
      });
    });
  });
};

util.inherits(WiFiPwdCharacteristic, BlenoCharacteristic);

WiFiPwdCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('WiFiPwdCharacteristic - onReadRequest: value = ' + this._value.toString('utf8'));

  callback(this.RESULT_SUCCESS, this._value);
};

WiFiPwdCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
  Pwd = this._value.toString('utf8');

  console.log('WiFiPwdCharacteristic - onWriteRequest: value = ' + Pwd);

  if (this._updateValueCallback) {
    console.log('WiFiPwdCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

return {
  SSIDCharacteristic: WiFiSSIDCharacteristic,
  PwdCharacteristic: WiFiPwdCharacteristic
}

}();

module.exports = characteristics;
