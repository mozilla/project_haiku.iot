var intervalID;
var statusData = {};

function startPolling() {
  stopPolling();
  intervalID = setInterval(requestStatus, 2000);
}

function stopPolling() {
  if (intervalID) {
    clearInterval(intervalID);
  }
  intervalID = null;
}

function requestStatus() {
  // make a request to /status.json every 10s
  window.fetch('http://localhost:3000/status.json?' + Date.now()).then(function(response) {
    //console.log(response.statusText);
    document.getElementById("serverStatus").innerHTML = response.statusText;

    response.json().then(function(json) {
      var didChange = updateStatus(json);
      if (didChange) {
        renderStatus();
      }
    });
  });
}

function updateStatus(data) {
  // store updated value, did the value change?
  console.log('updateStatus with data', data);
  var value = data.value;
  var didChange;
  var lastModified = data['last-modified'];
  if (value === statusData.value && lastModified == statusData.lastModified) {
    didChange = false;
  } else {
    didChange = true;
  }
  statusData.value = value;
  statusData.lastModified = lastModified;
  return didChange;
}

function renderStatus() {
  console.log('renderStatus:', statusData);
  // could mock some LED sequ  ences here?
  // and/or just print the status value and last-modified date for now
  var led = document.getElementById("led0");
  console.log(led);
}
