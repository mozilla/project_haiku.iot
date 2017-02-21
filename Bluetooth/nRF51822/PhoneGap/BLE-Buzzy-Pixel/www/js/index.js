// BuzzyPixel Service UUIDs
var BLE_BUZZ_PIXEL_SERVICE = '0318e986-54b5-11e6-beb8-9e71128cae77';
var PUSH_COLOR_STATUS = '0318ef80-54b5-11e6-beb8-9e71128cae77';
var READ_DEVICE_STATUS = '0318f084-54b5-11e6-beb8-9e71128cae77';

var app = {
  foundDevices: [],
  initialize: function() {
    this.bind();
  },

  bind: function() {
    document.addEventListener('deviceready', this.deviceready, false);
    statusScreen.hidden = true;
  },

  deviceready: function() {
    // wire buttons to functions
    deviceList.ontouchstart = app.connect;
    refreshButton.ontouchstart = app.scan;
    disconnectButton.ontouchstart = app.disconnect;
    updateButton.ontouchstart = app.updateStatusOnDevice;
    new Promise(function (resolve, reject) {
        bluetoothle.initialize(resolve, { request: true, statusReceiver: false });
    }).then(app.initializeSuccess, app.handleError);
  },

  initializeSuccess: function(result) {
    if (result.status === "enabled") {
      app.log("Bluetooth is enabled.");
      app.log(result);
      bluetoothle.hasPermission(function() {
        bluetoothle.requestPermission(function() {
          app.scan();
          app.log("Bluetooth permission request sucess.");
        }, function() {
          app.log("Bluetooth permission request error.");
        });
      });
    }
    else {
      refreshButton.disabled = true;
      app.log("Bluetooth is not enabled:", "status");
      app.log(result, "status");
    }
  },

  scan: function(e) {
    deviceList.innerHTML = ""; // clear the list
    app.foundDevices = [];
    bluetoothle.startScan(app.startScanSuccess, app.handleError, { services: [BLE_BUZZ_PIXEL_SERVICE] });

    // stop scan after 10 seconds
    setTimeout(function(){ app.stopScan(); }, 10000);
  },

  startScanSuccess: function(result) {
    var listItem, rssi;

    app.log("startScanSuccess(" + result.status + ")");
    if (result.status === "scanStarted") {
      app.log("Scanning for devices ...", "status");
    } else if (result.status === "scanResult") {
      if (!app.foundDevices.some(function (device) {
        return device.address === result.address;
      })) {
        listItem = document.createElement('li');
        listItem.dataset.deviceId = result.address;
        if (result.rssi) {
          rssi = "RSSI: " + result.rssi + "<br/>";
        } else {
          rssi = "";
        }
        listItem.innerHTML = result.name + "<br/>" + rssi + result.address;
        deviceList.appendChild(listItem);
        app.foundDevices.push(result);
      }
    }
  },

  stopScan: function() {
    bluetoothle.stopScan(app.onScanComplete, app.handleError);
  },

  onScanComplete: function(result) {
    if (result.status === "scanStopped") {
      var deviceListLength = deviceList.getElementsByTagName('li').length;
      if (deviceListLength === 0) {
        app.setStatus("No Bluetooth Peripherals Discovered.");
      } else {
        app.setStatus("Found " + deviceListLength +
          " device" + (deviceListLength === 1 ? "." : "s."));
      }
    }
  },

  connect: function (e) {
    app.setStatus("Connecting...");
    var deviceId = e.target.dataset.deviceId;
    app.log("Requesting connection to " + deviceId);
    bluetoothle.connect(app.connectSuccess, app.connectError, { address: deviceId });
  },

  connectSuccess: function(result) {
    if (result.status === "connected") {
      app.log(result);
      app.connectedPeripheral = result;
      // TBD move to renderUI function
      bleDeviceName.innerText = result.name + '-' + result.address;
      connectionScreen.hidden = true;
      statusScreen.hidden = false;

      app.setStatus("Connected.");
      new Promise(function (resolve, reject) {
        bluetoothle.discover(resolve, reject,
          { address: app.connectedPeripheral.address });
        }).then(function(result) {
          app.log("Disovered services are:");
          app.log(result);
          resetPolling();
          // Should Stop advertising after successful connect
          // to save battery
          bluetoothle.subscribe(app.onData, app.handleError,
            { address: app.connectedPeripheral.address, service: BLE_BUZZ_PIXEL_SERVICE, characteristic: READ_DEVICE_STATUS});
          }, app.handleError);
    } else if (result.status === "disconnected") {
      // device unexpectedly disconnects
      unexpectedDisconnect();
    }  else {
      app.setStatus("Unexpected connect status: " + result.status);
      app.disconnect();
    }
  },

  handleAdvertising: function() {
    bluetoothle.isAdvertising(function(result) {
      if (result.isAdvertising) {
        app.setStatus('BLE Device still advertising');
      }
      else {
        app.setStatus('BLE Device has stopped advertising');
      }
    }, app.handleError);
  },

  connectError: function(obj) {
    app.setStatus("Connect error: ");
    app.log("Connect error: " + obj.error + " - " + obj.message);
    app.disconnect();
  },

  disconnect: function(event) {
    app.setStatus("Disconnecting...");
    bluetoothle.close(function() {
      stopPolling();
      // Start Advertising so that device can be picked by scan
      bleDeviceName.innerText = '';
      connectionScreen.hidden = false;
      statusScreen.hidden = true;
      app.setStatus("Disconnected");
      setTimeout(app.scan, 1000);
    }, app.handleError, { "address": app.connectedPeripheral.address});
  },

  onData: function(result) {
    app.log(result.status);
    if (result.status === "subscribed") {
      app.handleAdvertising();
    }

    if ((result.status === "read")  || (result.status === "subscribedResult")) {
      var arStatus = bluetoothle.encodedStringToBytes(result.value);
      var homeSlot = 'status' + selfLED;
      homeSlot.value = arStatus[0];
      readStatusText.innerText = arStatus[0];
      // Update self status in cloud
      var status = arStatus[0] ? 1 : 0;
      postNewStatus(baseURL + selfURL, status);
    }
  },

  readStatusFromBLE: function() {
    // read values from BLE device
    bluetoothle.read(app.onData, app.handleError,
      { address: app.connectedPeripheral.address, service: BLE_BUZZ_PIXEL_SERVICE, characteristic: READ_DEVICE_STATUS });
  },

  // Handle Status update from App Update button click
  updateStatusOnDevice: function (evt) {
    var value = new Uint8Array(ledLength);
    for (var i in value) {
      value[i] = window['status' + i].value;
    }
    app.sendStatusToBLENano(value);
  },

  sendStatusToBLENano: function(arStatus) {
    var encodedString = bluetoothle.bytesToEncodedString(arStatus);
    app.log("Encoded string" + encodedString);

    bluetoothle.write(app.writeSuccess, app.handleError,
      { address: app.connectedPeripheral.address, service: BLE_BUZZ_PIXEL_SERVICE,
        characteristic: PUSH_COLOR_STATUS, value: encodedString });
  },

  writeSuccess: function(result) {
    if (result.status === "written") {
      var arStatus = bluetoothle.encodedStringToBytes(result.value);
      for (var i in arStatus) {
        window['status' + i].value = arStatus[i];
        app.log(arStatus[i]);
      }
      // This is needed to update push characteristic with the written value for Home LED
     /* bluetoothle.read(function() { app.log('Buzzy-pixel read status from device complete'); },
        app.handleError,
        { address: app.connectedPeripheral.address, service: BLE_BUZZ_PIXEL_SERVICE,
          characteristic: PUSH_COLOR_STATUS });*/
    }
  },

  setStatus: function(status) {
    messageDiv.innerText = messageDiv.innerText + '\n' + status;
  },

  log: function(msg, level) {
    level = level || "log";
    if (typeof msg === "object") {
      msg = JSON.stringify(msg, null, "  ");
    }
    console.log(msg);
    if (level === "status" || level === "error") {
      app.setStatus(msg);
    }
  },

  handleError: function (error) {
    var msg;
    if (error.error && error.message) {
      var errorItems = [];
      if (error.service) {
        errorItems.push("service: " + error.service);
      }
      if (error.characteristic) {
        errorItems.push("characteristic: " + error.characteristic);
      }
      msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    }
    else {
      msg = error;
    }
    app.log(msg, "error");

    if (error.error === "read" && error.service && error.characteristic) {
      app.setStatus(error.service, error.characteristic, "Error: " + error.message);
    }
  }
};

app.initialize();
