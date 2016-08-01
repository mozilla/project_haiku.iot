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
function sendClick(ct){
  var fetchResponse = window.fetch('http://localhost:3000/status'+ct+'.json'+'?'+Date.now()).then(
      function onSuccess(response){
        return response.json();
      },
      function onError(err){
        console.console.warn("Error fetching"+ 'http://localhost:3000/status'+ct+'.json', err);
      }
    );
    fetchResponse.then(result => {
     var urlKeys = Object.keys(statusItems);
     // update each status (model)
       var urlKey = urlKeys[ct];
       updateStatus(urlKey, result);
     // ..then updating the rendering of each

       renderStatus(urlKey);
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
   var urlKeys = Object.keys(statusItems);
   // update each status (model)
   results.forEach((data, idx) => {
     var urlKey = urlKeys[idx];
     updateStatus(urlKey, data);
   });
   // ..then updating the rendering of each
   urlKeys.forEach((urlKey, idx) => {
     renderStatus(urlKey);
   });
});
}

function updateStatus(urlKey, data) {
  var statusData = statusItems[urlKey];
  // the page can be loaded with a querystring like example.html?id=status1,
  // the config.id is populated in config.js
  var userId = urlKey.replace(/\/([^\.]+).json/, '$1');
  // are we updating the status that represents ourself?
  var isSelf = config && config.id === userId;

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
  statusData.isSelf = isSelf;
}
function renderStatus(urlKey) {
  var statusData = statusItems[urlKey];
  var idx = Object.keys(statusItems).indexOf(urlKey);

  if (statusData.didChange) {
    console.log('renderStatus:', urlKey, statusData);
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
}
