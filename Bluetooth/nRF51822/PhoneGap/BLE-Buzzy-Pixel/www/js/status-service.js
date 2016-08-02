var intervalID;

function objectValues(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

function startPolling() {
  stopPolling();
  intervalID = setInterval(requestStatus, 10000);
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

function postNewStatus(url, newStatusValue) {
  cordovaFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: "value="+newStatusValue
  }).then(function (response){
    console.log('Device Status posted to cloud');
    const responseJSON = JSON.parse(response.statusText);
    console.log(responseJSON['last-modified']);
    if (response.status == 200 && responseJSON.ok) {
      messageDiv.innerText = newStatusValue;
    }
  }).catch(function(ex) {
    console.log('Error while invoking post url', ex);
    console.log(url);
  });
}

function requestStatus() {
  // function inside Request Status should return a promise
  // when that promise is resolved pass array of status to BLENano device
  console.log('Buzzy Pixel polling request');
  getStatusFromCloud().then((data) => {
    console.log('sending request to ble nano');
    for (var i in data) {
      console.log(data[i]);
    }
    app.sendStatusToBLENano(data);
  });
}

function getStatusFromCloud() {
  return new Promise((resolve, reject) => {
    var arrStatus = new Uint8Array(ledLength);
    var ledCount = 0;

    function handleResult(status, idx) {
      arrStatus[idx] = status;
      console.log('Status received buzzy pixel');
      console.log(idx);
      console.log(arrStatus[idx]);
      ledCount ++;
      if (ledCount >= ledLength) {
        resolve(arrStatus);
      }
    }
    Object.keys(statusItems).forEach(function(key, idx) {
      httpGetRequest(key, idx, handleResult);
    });
  });
}

function httpGetRequest(url, idx, cb) {
  cordovaFetch(baseURL + url +'?'+Date.now(), {
    method : 'GET',
    headers: {
      "Content-Type": "application/json"
    },
  }).then(function (response) {
    const responseJSON = JSON.parse(response.statusText);
    console.log('statustext');
    console.log(response.status);
    console.log(responseJSON['last-modified']);
    console.log(responseJSON.value);
    if (response.status == 200) {
      cb(responseJSON.value, idx);
    } else {
      cb(null);
    }
  }).catch(function(ex) {
    console.log('Get request failed', ex)
  });
}
