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
  fetch('user/'+ config.id +'/status').then(
    function onSuccess(response) {
      return response.json();
    }, 
    function onFailure(err) {
      console.error('Could not request my status');
    }
  ).then(function(data) {
    appState.mySlot.status = data;

    renderApp();
  });

  getMySlots();

  var intervalID = setInterval(getMySlots, 2000);
}

function getMySlots() {
  fetch('user/'+ config.id +'/slots').then(
    function onSuccess(response) {
      return response.json();
    }, 
    function onFailure(err) {
      console.error('Could not request my slots');
    }
  ).then(function(data) {
    appState.slots = data.value.map(function(id){
      if (id === null) {
        return null;
      }
      
      return {
        id: id,
        status: null
      };
    });

    var fetchPromises = appState.slots.map(function(slot) {
      if (slot === null) {
        return null;
      }

      return fetch('user/'+ slot.id +'/status');
    })

    Promise.all(fetchPromises).then(function(responses) {
      var jsonPromises = responses.map(function (response) {
        if (response === null) {
          return null;
        }

        return response.json()
      });

      return Promise.all(jsonPromises);    
    }).then(function(dataSet) {
      dataSet.forEach(function(data, idx) {
        if (data === null) {
          return;
        }
        
        appState.slots[idx].status = data;
      })
      renderApp();
    });
  });
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

  var fetchConfig = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json'
    }), 
    body: JSON.stringify(data)
  };

  fetch('user/'+ config.id +'/status', fetchConfig).then(
    function onSuccess(response) {
      return response.json();
    }, 
    function onFailure(err) {
      console.error('Could not update my status');
    }
  ).then(function(data) {
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
