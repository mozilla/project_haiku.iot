// Slot assigned to wearable owner
var selfLED = 4;
// Address where status service is running
var baseURL = 'http://127.0.0.1:3000';
// Slot URL of the owner
var selfURL = '/user/4/status';
// Number of slots on wearable
var ledLength = 7;
// Slots URL with statusData for each person
var statusItems = {
  '/user/0/status': {},
  '/user/1/status': {},
  '/user/2/status': {},
  '/user/3/status': {},
  '/user/4/status': {},
  '/user/5/status': {},
  '/user/6/status': {}
};
