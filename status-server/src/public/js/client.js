var intervalID;
var statusItems = {
  '/status0.json': {},  // statusData for each person
  '/status1.json': {},  // statusData for each person
  '/status2.json': {},  // statusData for each person
  '/status3.json': {},  // statusData for each person
  '/status4.json': {}  // statusData for each person
};

function objectValues(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

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

function togglePolling(btn) {
  if (intervalID) {
    stopPolling();
    btn.value = "Start";
  } else {
    startPolling();
    btn.value = "Stop";
  }
}

function requestStatus() {
  var fetchResponses = Object.keys(statusItems).map(url => {
    // make a request to /status.json every 10s
    return window.fetch(url +'?'+Date.now()).then(
      function onSuccess(response) {
        return response.json();
      },
      function onError(err) {
        console.warn("Error fetching " + url, err);
      }
    );
  });

  Promise.all(fetchResponses).then(results => {
    updateStatus(results);
    renderStatus();
  });
}

function updateStatus(results) {
  var urlKeys = Object.keys(statusItems);
  results.forEach((data, idx) => {
    var urlKey = urlKeys[idx];
    var statusData = statusItems[urlKey];

    // store updated value, did the value change?
    var value = data.value;
    var didChange;
    var lastModified = data['last-modified'];
    if (value === statusData.value && lastModified == statusData.lastModified) {
      didChange = false;
    } else {
      console.log('updateStatus with changed data', data);
      didChange = true;
    }
    statusData.value = value;
    statusData.lastModified = lastModified;
    statusData.didChange = didChange;
  });
}

function renderStatus() {
  Object.keys(statusItems).forEach((url, idx) => {
    var statusData = statusItems[url];
    if (statusData.didChange) {
      console.log('renderStatus:', url, statusData);
      // could mock some LED sequ  ences here?
      // and/or just print the status value and last-modified date for now
      var led = document.getElementById("led"+idx).getContext('2d');
      var color;
      switch (statusData.value) {
        case ':-(':
        case ':(':
        case '0':
          color = 'red';
          break;
        case ':-)':
        case ':)':
        case '1':
          color = 'green';
          break;
      }
      led.fillStyle = color;
      led.fillRect(0,0,40,40);
    }
  });
}
