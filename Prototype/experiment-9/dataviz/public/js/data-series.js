(function(exports) {
  'use strict';
  var DataSeries = exports.DataSeries = {
    create: function(dataArray, opts) {
      // find first and last date
      var series = Object.create(opts);
      var firstDate, lastDate;

      series.data = dataArray.map(function(entry, i) {
        var date = new Date(entry.datetime);
        entry.type = opts.type;
        return [date, util.getSecondsFromDurationString(entry.duration), entry];
      });

      series.data.forEach(function(row, i) {
        var d = row[0];
        if (!firstDate || d < firstDate) {
          firstDate = d;
        }
        if (!lastDate || d > lastDate) {
          lastDate = d;
        }
      });
      series.firstDate = firstDate;
      series.lastDate = lastDate;

      return series;
    }
  };
})(window);