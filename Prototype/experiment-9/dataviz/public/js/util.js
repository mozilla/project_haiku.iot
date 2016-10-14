(function(exports) {
  'use strict';
  var util = exports.util = {};
  util.DAY_MS = 1000*60*60*24;

  function getDateKey(d) {
    return [d.getFullYear(), d.getMonth()+1, d.getDate()].join('-');
  }
  util.getDateKey = getDateKey;

  function getPositionForDate(date, startDate, endDate, size) {
    var span = endDate.getTime() - startDate.getTime();
    var fromStart = date.getTime() - startDate.getTime();
    var propn = fromStart/span;
    return size * propn;
  }
  util.getPositionForDate = getPositionForDate;

  function getSecondsFromDurationString(str) {
    var resultSeconds = 0;
    if (str == 'NA') {
      return resultSeconds;
    }
    var m = str.match(/(\d+)min\s+(\d+)sec/);
    if (m) {
      var min = parseInt(m[1], 10);
      var sec = parseInt(m[2], 10);
      resultSeconds = sec + min*60
    } else {
      console.warn('didnt match in duration string: ', str);
    }
    return resultSeconds;
  }
  util.getSecondsFromDurationString = getSecondsFromDurationString;

  function startOfDay(d) {
    var start = new Date(d);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  util.startOfDay = startOfDay;

  function getParamfromQueryString(queryStr, paramName) {
    var query = {};
    var pairs, nameValue, params = {};
    if(!queryStr) {
      return;
    }
    pairs = queryStr.split('&');
    for(var i=0; i<pairs.length; i++) {
      nameValue = pairs[i].split('=');
      if(nameValue[0] && (nameValue[0] === paramName)){
        return nameValue[1];
      }
    }
  }
  util.getParamfromQueryString = getParamfromQueryString;

  function mixin(target) {
    var source;
    for(var argIndex=1; argIndex<arguments.length; argIndex++) {
      var source = arguments[argIndex];
      for(var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  util.mixin = mixin;
})(window)