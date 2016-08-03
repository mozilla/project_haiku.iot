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
    if(btn) {
      btn.value = "Start";
    }
  } else {
    startPolling();
    if (btn) {
      btn.value = "Stop";
    }
  }
}

function init() {
  // update the main heading if this client instance was passed an id
  if (config) {
    // assign a default id if none was passed
    if (!config.id) {
      config.id = 'user0';
    }
    var titleNode = document.querySelector('h1');
    if (titleNode) {
      titleNode.innerHTML = 'status client: ' + config.id;
    }
    // temporarily map the user id to the led node just by aligning the indices.
    // We'll want a proper slots=>users mapping eventually
    Array.forEach(document.querySelectorAll('.led'), (node, idx) => {
      var userId = node.id.replace(/^led([0-9])+/, 'user$1');
      node.dataset.user = userId;
      if (userId == config.id) {
        node.classList.add('isSelf');
      }
    });
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
  if (config && config.autostart) {
    togglePolling(document.getElementById('pollingBtn'));
  }
}
function handleLEDClick(ct) {
  var urlKey = '/status'+ct+'.json';
  var userId = urlKey.replace(/\/([^\.]+)\.json/, '$1');
  var isSelf = config && config.id === userId;
  // NOTE: for now, click just means update status, and we can only update our own status
  // so ignore clicks on other LEDs
  if (isSelf) {
    postNewStatus(urlKey);
  } else {
    console.log('Ignoring click on LED for '+userId+' that isnt the status of me: ' + config.id);
  }
}
function postNewStatus(urlKey){
  // logic is inverted here so an undefined/unknown status is set to '1' by default
  var newStatusValue = statusItems[urlKey].value !== '1' ? '1' : '0';
  window.fetch(urlKey, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    body: "value="+newStatusValue
  }).then(
      function onSuccess(response){
        return response.json().then((result) => {
          console.log('result: ', result);
          if (result.ok) {
            // update our local value when the server confirms the request was successful
            //  temporary shim, the server should include the new value in the response
            result.value = newStatusValue;
            return updateStatus(urlKey, result);
          }
        });
      },
      function onError(err){
        console.console.warn("Error fetching"+ 'http://localhost:3000/status'+ct+'.json', err);
      }
    ).then(function() {
      console.log('rendering in postNewStatus');
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
   var didChange = urlKeys.reduce((changed, key, idx) => {
    var item = statusItems[key];
    return changed || didChange;
   }, false);
   console.log('Incoming status change');
   // TODO: could signal a change across the whole strip?

   urlKeys.forEach((urlKey, idx) => {
     renderStatus(urlKey);
   });
});
}

function updateStatus(urlKey, data) {
  var statusData = statusItems[urlKey];
  // the page can be loaded with a querystring like example.html?id=status1,
  // the config.id is populated in config.js
  var userId = urlKey.replace(/\/([^\.]+)\.json/, '$1');
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
    // could mock some LED sequences here?
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
