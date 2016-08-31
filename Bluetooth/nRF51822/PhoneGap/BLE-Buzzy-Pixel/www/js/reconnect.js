  var reconnectTimer = null;

  function unexpectedDisconnect() {
    // If BLE device unexpected disconnect, try reconnecting
    stopPolling();
    app.log('Trying Reconnect...', 'status');
    // Try reconnect for 10 seconds after which explicitly call app.disconnect
    bluetoothle.reconnect(reconnectSuccess, reconnectError, { address: app.connectedPeripheral.address});
    reconnectTimer = setTimeout(reconnectTimeout, 10000);
  }

  function reconnectTimeout() {
    // Reconnection timed out, call app.disconnect
    app.setStatus("Reconnection timed out");
    app.disconnect();
  }

  function clearReconnectTimeout() {
    app.log("Clearing reconnect timeout");
    if (reconnectTimer != null)
    {
      clearTimeout(reconnectTimer);
    }

    reconnectTimer = null;
  }

  function reconnectSuccess(result) {
    app.log(result);
    clearReconnectTimeout();

    if (result.status == "connected") {
      resetPolling();
      app.setStatus("Reconnected to : " + result.name + " - " + result.address);
    } else if (result.status == "disconnected") {
      app.setStatus("Try reconnecting to : " + result.name + " - " + result.address);
      // device unexpectedly disconnects
      unexpectedDisconnect();
    } else {
      app.setStatus("Unexpected reconnect status: " + result.status);
      app.disconnect();
    }
  }

  function reconnectError(obj) {
    app.setStatus("Reconnect error: ");
    app.log("Reconnect error: " + obj.error + " - " + obj.message);
    clearReconnectTimeout();
    app.disconnect();
  }
