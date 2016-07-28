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

function init() {
  // update the main heading if this client instance was passed an id
  if (config && config.id) {
    var titleNode = document.querySelector('h1');
    if (titleNode) {
      titleNode.innerHTML = 'status client: ' + config.id;
    }
  }
  // populate the LEDs with some initial colors
  var colors = ['#ff00ff', '#ffff00', '#00ffff', '#00ff07', '#772cb6'];
  colors.forEach((color, idx) => {
    var node = document.getElementById("led" + idx);
    var ctx = node.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0,0,300,300);
    ctx.font = "10px Arial";
    ctx.strokeText(idx ,node.width/2,node.height/2);


  });
}
function animate(ct){
  var fetchResponse = window.fetch('http://localhost:3000/status'+ct+'.json'+Date.now()).then(
      function onSuccess(response){
        return response.json();
      },
      function onError(err){
        console.console.warn("Error fetching"+ url, err);
      }
    );


   updateValueStatus(ct);
   //blinkStatus(ct);

}

function updateValueStatus(ct){
  // var ch = '/status'+ct+'.json';
  // console.log(ch);
  // var statusUpdate = {ch: {} };
  // console.log(statusUpdate);
  // var urlKey = Object.keys(statusUpdate);
  // console.log(urlKey);
  // console.log(statusItems);
  var statusData = statusItems['/status'+ct+'.json'];
  console.log(statusData);
  var value = statusData.value;
  var didChange;
  var lastModified = statusData['last-modified'];
  if(value == 1){
    value = 0;
    didChange=true;
  } else if (value === 0){
    value =1;
    didChange=true;
  }else{
    didChange = false;
  }
  statusData.value = value;
  statusData.lastModified = Date.now();
  statusData.didChange = didChange;
}
function blinkStatus(ct){
    var statusData = statusItems['/status'+ct+'.json'];
    if (statusData.didChange) {
      console.log('render blink status:', '/status'+ct+'.json', statusData);
      var nodeSelected = document.getElementsByName("iframeS1").contentWindow.getElementById("led"+ct).getContext("2d");
      var color;
      switch (statusData.value) {
        case '0':
          color = 'red';
          break;
        case '1':
          color = 'green';
          break;
      }
      nodeSelected.fillStyle = color;
      nodeSelected.fillRect(0,0,40,40);
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
