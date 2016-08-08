var intervalID;
var statusItems = {
  '/user/0/status': {},
  '/user/1/status': {},
  '/user/2/status': {},
  '/user/3/status': {},
  '/user/4/status': {},
  '/user/5/status': {},
  '/user/6/status': {}
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
      if (config && config.id.endsWith(idx)) {
        node.classList.add('isSelf');
      }
    });
  }

  if (config && config.autostart) {
    togglePolling(document.getElementById('pollingBtn'));
  }
}
function handleLEDClick(ct) {
  var urlKey = '/user/'+ct+'/status';
  // NOTE: we'll actually need to match user id here once we have a proper way to represent users
  // for now I'm just checking the last character is the same digit
  var isSelf = config && config.id.endsWith(ct);
  console.log('isSelf: ', isSelf);
  // NOTE: for now, click just means update status, and we can only update our own status
  // so ignore clicks on other LEDs
  if (isSelf) {
    postNewStatus(urlKey);
  } else {
    console.log('Ignoring click on LED for '+ct+' that isnt the status of me: ' + config.id);
  }
}
function postNewStatus(urlKey){
  // logic is inverted here so an undefined/unknown status is set to '1' by default
  var newStatusValue = statusItems[urlKey].value !== '1' ? '1' : '0';
  window.fetch(urlKey, {
    method: 'PUT',
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
        console.warn("Error fetching"+ 'http://localhost:3000/user/'+ct+'/status', err);
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
      return changed || item.didChange;
    }, false);
    if (didChange) {
      urlKeys.forEach((urlKey, idx) => {
       renderStatus(urlKey);
      });
    }
    // TODO: could signal a change across the whole strip?
  });
}

function updateStatus(urlKey, data) {
  var statusData = statusItems[urlKey];
  // the page can be loaded with a querystring like example.html?id=status1,
  // the config.id is populated in config.js
  var userNum = urlKey.replace(/\/[^0-9]*([0-9]+)\/status/, '$1');

  // are we updating the status that represents ourself?
  var isSelf = config && config.id.endsWith(userNum);

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
    //var led = document.getElementById("led"+idx);
    var color;
    switch (statusData.value.trim()) {
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
    document.getElementById("led"+idx).style.backgroundColor = color;
    //led.fillRect(0,0,40,40);
  }
}
