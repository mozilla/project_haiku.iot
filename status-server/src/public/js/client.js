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
  console.log(response.statusText);
});
  // call updateStatus in the callback
  var intervalID = setInterval(function() { pollStatus(); }, 2000);
}

function updateStatus() {
  // store updated value, did the value change?
  // call render if value or last-modified changed
}
function renderStatus(idx, value) {
  // could mock some LED sequences here?
  // and/or just print the status value and last-modified date for now
}
