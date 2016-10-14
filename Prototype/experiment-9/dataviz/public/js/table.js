(function(exports) {
  'use strict';

  var Table = exports.Table = {
    create: function(opts) {
      return new EventSeriesTable(opts);
    }
  };

  function EventSeriesTable(opts) {
    this.options = opts
  }
  Table.prototype = {};

  function drawTable(table, allSeries, opts) {
    opts = opts ? util.mixin(Object.create(this.options), opts) : this.options;
    var tfoot = document.createElement('tfoot');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var dataRowsFragment = document.createDocumentFragment();
    var eventTypeCols = {};
    var colCount = allSeries.length;
    var entriesByDate = []

    allSeries.forEach(function(series, i) {
      eventTypeCols[series.type] = i+1;
      entriesByDate.push.apply(entriesByDate, series.data);
    });

    var colHeaders = allSeries.map(function(series) {
      return series.label;
    });
    colHeaders.unshift('Date/Time');
    colHeaders.forEach(function(label) {
      var th = document.createElement('th');
      thead.appendChild(th);
      th.textContent = label;
    });

    entriesByDate.sort(function(a,b){
      // the first entry in the array is a date object
      return a[0] - b[0];
    });

    entriesByDate.forEach(function(seriesRow) {
      var rowData = [];
      var entry = seriesRow[2];
      var colIndex = eventTypeCols[entry.type];
      colHeaders.forEach(function(col, i) {
        var value = '';
        if (i === 0) {
          value = seriesRow[0].toLocaleString();
        } else if (i === colIndex) {
          if (entry.duration && entry.duration !== 'NA') {
            value = entry.duration;
          } else {
            value = '\u2022';
          }
        }
        rowData.push(value);
      });
      dataRowsFragment.appendChild(createTableRow(rowData));
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tbody.appendChild(dataRowsFragment);
  };
  EventSeriesTable.prototype.draw = drawTable;

  function createTableRow(colsData) {
    var tr = document.createElement('tr');
    colsData.forEach(function(content) {
      var td = document.createElement('td');
      td.textContent = content;
      tr.appendChild(td);
    });
    return tr;
  }
  exports.Table.createTableRow = createTableRow;

})(window);