function pollStatus() {
  // make a request to /status.json every 10s
  // call updateStatus in the callback
}
function updateStatus() {
  // store updated value, did the value change?
  // call render if value or last-modified changed
}
function renderStatus(idx, value) {
  // could mock some LED sequences here?
  // and/or just print the status value and last-modified date for now
}
