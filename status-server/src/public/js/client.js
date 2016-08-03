var intervalID;
var statusItems = {
  '/user/0/status.json': {},  // statusData for each person
  '/user/1/status.json': {},  // statusData for each person
  '/user/2/status.json': {},  // statusData for each person
  '/user/3/status.json': {},  // statusData for each person
  '/user/4/status.json': {}  // statusData for each person
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

function init() {
  // update the main heading if this client instance was passed an id
  if (config && config.id) {
    console.log('config.id: ', config.id)
    var titleNode = document.querySelector('h1');
    if (titleNode) {
      titleNode.innerHTML = 'status client: ' + config.id;
    }
  }
  // populate the LEDs with some initial colors
  var colors = ['#ffff00', '#ffff00', '#00ffff', '#00ff07', '#772cb6'];
  colors.forEach((color, idx) => {
    var node = document.getElementById("led" + idx);
    var ctx = node.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0,0,300,300);
  });
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
