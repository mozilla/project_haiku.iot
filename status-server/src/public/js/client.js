/* global config */

var pollIntervalID;
var appState = {
  mySlot: {
    id: config.id,
    status: {}
  },
  slots: []
};
var gPixelNodes;
var gPixels;
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
  initStatuses().then(startPolling);
}

function startPolling() {
  if (pollIntervalID) {
    return;
  }
  pollIntervalID = setInterval(fetchAndRenderSlots, 2000);
}

function stopPolling() {
  clearInterval(pollIntervalID);
  pollIntervalID = null;
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
      statusData.didChange = true;
      appState.mySlot.status = statusData;
    } else {
      // got no data, now what?
    }
    if (slotsData) {
      appState.slots = slotsData.value.map(function(id){
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

function setPixelNodeColor(node, color) {
  var colorStr;
  if ('h' in color) {
    // assume HSV
    var hsvColor = color;
    color = Color.HSVtoRGB(hsvColor);
  }
  var colorStr = 'rgb('+color.r.toFixed(0)+','+color.g.toFixed(0)+','+color.b.toFixed(0)+')';
  node.style.backgroundColor = colorStr;
}

function paintPixels() {
  for(var i=0; i<gPixels.length; i++) {
    setPixelNodeColor(gPixelNodes[i], gPixels[i].color);
  }
}

function initRendering() {
  var titleNode = document.querySelector('h1');
  if (titleNode) {
    titleNode.innerHTML = 'status client: ' + config.id;
  }
  gPixelNodes = document.querySelectorAll('#band > .led');

  // SlotsAnimationManager prepares a view-model for each slot (including self) we need to render
  gPixels = SlotsAnimationManager.initSlots(new Array(gPixelNodes.length));
  // give it a render function to be called each animation frame
  SlotsAnimationManager.render = paintPixels;
  // start calling render ~60fps
  SlotsAnimationManager.start();
}

function fetchAndRenderSlots() {
  var fetchPromises = appState.slots.map(function(slot) {
    if (slot && ('id' in slot) && slot.id !== null) {
      return jsonRequest('/user/'+ slot.id +'/status');
    } else {
      return Promise.resolve(null);
    }
  });
  var fetched = Promise.all(fetchPromises);
  fetched.then(function(dataSet) {
    dataSet.forEach((data, idx) => updateSlot(data, idx, appState.slots));
  }).then(function() {
    renderApp();
  });
  fetched.catch(function(errors) {
    console.warn('fetchMySlots errback: ', errors);
  })
}

function updateSlot(newStatus, idx, collection) {
  var slot = collection[idx];
  if (!slot.id) {
    // empty slot.
    if (!slot.status) {
      slot.status = {
        value: 0,
        empty: true,
        didChange: true
      };
    }
    return;
  }
  var oldStatus = slot.status;
  // keep an existing didChange value - we only reset when we render
  var didChange = oldStatus ? oldStatus.didChange : true;
  var lastModified = newStatus['last-modified'];
  if (!didChange) {
    // NOTE: we could consider a more recent last-modified as a change needing rendering
    if (newStatus.value !== oldStatus.value) {
      console.log('updateStatus with changed newStatus', newStatus);
      didChange = true;
    }
  } else {
    didChange = true;
  }
  if (didChange) {
    slot.status = {
      value: newStatus.value,
      lastModified: newStatus['last-modified'],
      didChange: didChange
    }
  }
}

function renderApp() {
  // update the view model for the next tick
  var allSlots = [appState.mySlot].concat(appState.slots);
  allSlots.forEach(function(slot, idx) {
    var didChange;
    if (slot && slot.status) {

    }
    if (!slot) {
      // empty slot
    } else if (slot.status && slot.status.didChange) {
      console.log('renderApp: change slot status: ', idx, slot);
      SlotsAnimationManager.changeSlotStatus(idx, slot.status.value === '1' ? 1 : 0);
      // reset dirty flag
      slot.status.didChange = false;
    }
  });
}

function toggleMyStatus() {
  var oldStatus = appState.mySlot.status || { value: '0' };
  var newStatus = {
    value: oldStatus.value === '1' ? '0' : '1'
  };
  // optimistically update locally, we'll roll it back if the request fails
  updateSlot(newStatus, 0, [appState.mySlot]);

  var fetchConfig = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(newStatus)
  };

  // TODO: could fire and forget here as we're already getting regular updates from the server
  var statusUpdated = jsonRequest('user/'+ config.id +'/status', fetchConfig);
  statusUpdated.catch(function(error) {
    console.error('Could not update my status:', error);
    updateSlot(oldStatus, 0, [appState.mySlot]);
    renderApp();
  });

  renderApp();

  if (newStatus.value === '1') {
    startPolling();
  } else {
    stopPolling();
  }
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
