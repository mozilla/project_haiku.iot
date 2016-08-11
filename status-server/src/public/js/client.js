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

function init() {
  jsonRequest('GET', 'user/'+ config.id +'/status', function(err, data) {
    if (err) {
      console.error('Could not request my status');
      return;
    }

    appState.mySlot.status = data;

    renderApp();
  });

  getMySlots();

  var intervalID = setInterval(getMySlots, 2000);
}

function getMySlots() {
  jsonRequest('GET', 'user/'+ config.id +'/slots', function(err, data) {
    if (err) {
      console.error('Could not request my slots');
      return;
    }

    appState.slots = data.value.map(function(id){
      if (id === null) {
        return null;
      }
      
      return {
        id: id,
        status: null
      };
    });

    var reqTotal = 0;
    var reqComplete = 0;

    appState.slots.forEach(function(slot) {
      if (slot === null) {
        return;
      }

      reqTotal += 1;

      jsonRequest('GET', 'user/'+ slot.id +'/status', function(err, data) {
        if (err) {
          console.error('Could not request status of' + slot.id);
          return;
        }
        slot.status = data;
        
        reqComplete += 1;
        if (reqComplete === reqTotal) {
          renderApp();
        }
      });
    });
  });
}

function jsonRequest(method, path, data, callback) {
  if (typeof data === 'function') {
    callback = data;
  }

  var headerConfig = {}

  if (method === 'PUT') {
    headerConfig['Content-Type'] = 'application/json';
  }

  var fetchConfig = {
    method: method,
    headers: new Headers(headerConfig), 
    body: JSON.stringify(data)
  };

  window.fetch(path, fetchConfig).then(
      function onSuccess(response){
        response.json().then((json) => {
          callback(null, json);
        });
      },
      function onError(err){
        console.error("Error fetching" + path, err);
        callback(err);
      }
    );
}

function renderApp() {
  console.log('renderingApp')
  //render my status
  if (appState.mySlot.status.value === '1') {
    document.getElementById("myled").style.backgroundColor = 'green';
  }
  else {
    document.getElementById("myled").style.backgroundColor = 'red';
  }
  //render slots status
  appState.slots.forEach(function(slot, idx) {
    if (slot === null) {
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
  
  jsonRequest('PUT', 'user/'+ config.id +'/status', data, function(err, data) {
    if (err) {
      console.error('Could not update my status');
      return;
    }
    
    appState.mySlot.status.value = data.value;
    
    renderApp();
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
