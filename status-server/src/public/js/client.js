/* global config */

var appState = {
  mySlot: {
    id: config.id,
    status: {}
  },
  slots: []
};

/*
an example of the slots array
[
  null,
  {
    id: "5",
    status: {
      value: 1,
      last-modified: ''
    }
  },
  {id: "2", status: null},
  {id: "6", status: {...}},
  null,
  {id: "3", status: {...}}
]
*/

function jsonRequest(url, config) {
  // thin wrapper around fetch, to ensure errors go down the resolved path
  var promise = new Promise((resolve, reject) => {
    var fetched = window.fetch(url, config);
    fetched.catch(function(err) {
        // network or permissions error?
        console.warn('jsonRequest errback, request for %s produced error', url, err);
        resolve(null);
    });
    fetched.then(function(response) {
      return response.json().then(function(data) {
        resolve(data);
      });
    });
  });
  return promise;
}

function init() {
  initRendering();
  initStatuses().then(function() {
    setInterval(fetchAndRenderSlots, 2000);
  });
}

function initStatuses() {
  var statusPromise = jsonRequest('user/'+ config.id +'/status');
  var slotsPromise = jsonRequest('user/'+ config.id +'/slots');
  var initDataPromise = Promise.all([
    statusPromise, slotsPromise
  ]);

  initDataPromise.then(function (results) {
    var statusData = results[0];
    var slotsData = results[1];
    if (statusData) {
      appState.mySlot.status = statusData;
    } else {
      // got no data, now what?
    }
    if (slotsData) {
      appState.slots = slotsData.value.map(function(id){
        if (id === null) {
          return null;
        }
        return {
          id: id,
          status: null
        };
      });
    }
  }).then(function() {
    return fetchAndRenderSlots();
  });

  initDataPromise.catch(function (errors) {
    console.warn('Encountered errors in init: ', errors);
  });
  return initDataPromise;
}

function initRendering() {
  var titleNode = document.querySelector('h1');
  if (titleNode) {
    titleNode.innerHTML = 'status client: ' + config.id;
  }
  // temporarily map the user id to the led node just by aligning the indices.
  // We'll want a proper slots=>users mapping eventually
  Array.prototype.forEach.call(document.querySelectorAll('.led'), (node, idx) => {
    var userId = node.id.replace(/^led([0-9])+/, '$1');
    node.dataset.user = userId;
  });
}

function fetchAndRenderSlots() {
  var fetchPromises = appState.slots.map(function(slot) {
    if (slot && ('id' in slot)) {
      return jsonRequest('/user/'+ slot.id +'/status');
    } else {
      return Promise.resolve(null);
    }
  });
  var fetched = Promise.all(fetchPromises);
  fetched.then(function(dataSet) {
    dataSet.forEach(function(data, idx) {
      if (data === null) {
        return;
      }

      appState.slots[idx].status = data;
    });
  }).then(function() {
    renderApp();
  });
  fetched.catch(function(errors) {
    console.warn('fetchMySlots errback: ', errors);
  })
}

function renderApp() {
  //render my status
  if (appState.mySlot.status.value === '1') {
    document.getElementById("myled").style.backgroundColor = 'green';
  }
  else {
    document.getElementById("myled").style.backgroundColor = 'red';
  }
  //render slots status
  appState.slots.forEach(function(slot, idx) {
    if (!(slot && slot.status)) {
      document.getElementById("led"+idx).style.backgroundColor = 'grey';
    }
    else {
      if (slot.status.value === '1') {
        document.getElementById("led"+idx).style.backgroundColor = 'green';
      }
      else {
        document.getElementById("led"+idx).style.backgroundColor = 'red';
      }
    }
  })
}

function toggleMyStatus() {
  var data = {
    value: appState.mySlot.status.value === '0' ? '1' : '0'
  };

  var fetchConfig = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  };

  jsonRequest('user/'+ config.id +'/status', fetchConfig).then(function(data) {
    appState.mySlot.status.value = data.value;

    renderApp();
  }, function(error) {
    console.error('Could not update my status:', error);
  });
}

function sendMessage(idx) {
  alert('NOT IMPLEMENTED: send message to '+idx)
}

function Buzz(m){
  var audio = document.getElementById('buzz');

  audio.load();
  audio.play();
  setTimeout(function() {
    audio.pause();
  }, m);
}
