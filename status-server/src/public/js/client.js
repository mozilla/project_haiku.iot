function pollStatus() {
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE
    try {
      request = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (e) {
      try {
        request = new ActiveXObject('Microsoft.XMLHTTP');
      }
      catch (e) {}
    }
  }

   // make a request to /status.json every 10s
 window.fetch('http://localhost:3000/status.json').then(function(response) {
  //console.log(response.statusText);
  var value;
  document.getElementById("serverStatus").innerHTML = response.statusText;

  response.json().then(function(json) {
    console.log(json.value);
     value= json.status.value;
   });
  updateStatus(response.statusText,value);
});
//  var intervalID = setInterval(function() { pollStatus(); }, 2000);
}

function updateStatus(currentresponse,value) {
  // store updated value, did the value change?
  window.fetch('http://localhost:3000/status.json').then(function(response) {
   if (response.statusText == currentresponse){
     var led = document.getElementById("led0");

     console.log(led);
     console.log(value);
     //renderStatus(led,value);
   }
 });
  // call render if value or last-modified changed
}
function renderStatus(idx, value) {
  // could mock some LED sequ  ences here?
  // and/or just print the status value and last-modified date for now
}
