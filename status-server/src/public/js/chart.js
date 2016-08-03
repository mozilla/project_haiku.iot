"use strict";

function Chart(node) {
  this.node = node;
  this.xPadding = 40;
  this.yPadding = 30;
  this.series = [];
}
Chart.prototype.addSeries = function(series, options) {
  // TODO: support multiple series on the same chart
  if (options) {
    series.renderOptions = options;
  }
  this.series.push(series);
  this.series.forEach(series => {
    var maxY = series.reduce((prev, curr, idx) => {
      return curr.y > prev ? curr.y : prev;
    }, 0);
    var maxX = this.maxX = series.reduce((prev, curr, idx) => {
      return curr.x > prev ? curr.x : prev;
    }, 0);
    var minY = series.reduce((prev, curr, idx) => {
      return curr.y < prev ? curr.y : prev;
    }, maxY);
    var minX = series.reduce((prev, curr, idx) => {
      return curr.x < prev ? curr.x : prev;
    }, maxX);

    if (isNaN(this.maxY) || maxY > this.maxY) {
      this.maxY = maxY;
    }
    if (isNaN(this.minY) || minY < this.minY) {
      this.minY = minY;
    }
    if (isNaN(this.maxX) || maxX > this.maxX) {
      this.maxX = maxX;
    }
    if (isNaN(this.minX) || minX < this.minX) {
      this.minX = minX;
    }
    var xIncrements = 10;
    var rangeX = this.rangeX = getRange(this.minX, this.maxX);
    var rangeY = this.rangeY = getRange(this.minY, this.maxY);
  });
};

Chart.prototype.drawAxes = function() {
  if (!this.series.length) {
    console.warn("No series added");
    return;
  }
  var graph = this.node,
      ctx = graph.getContext('2d');
  // draw axes
  ctx.clearRect(0, 0, graph.width, graph.height);
  ctx.font = 'italic 6pt sans-serif';
  ctx.textAlign = "center";
  ctx.strokeStyle = '#ccc';

  console.log("drawing axes");
  ctx.beginPath();
  ctx.moveTo(this.xPadding, 0);
  ctx.lineTo(this.xPadding, graph.height - this.yPadding);
  ctx.lineTo(graph.width, graph.height - this.yPadding);
  ctx.stroke();

  var i;
  for(i=this.rangeX[0]; i < this.rangeX[1]; i+=this.rangeX[2]) {
    ctx.fillText(i, this.getXPixel(i), graph.height - this.yPadding + 20);
  }
  ctx.textAlign = "right"
  ctx.textBaseline = "middle";
  for(i=this.rangeY[0]; i < this.rangeY[1]; i+=this.rangeY[2]) {
    ctx.fillText(i, this.xPadding - 10, this.getYPixel(i));
  }
};
Chart.prototype.getXPixel = function(val) {
  var width = this.node.width - this.xPadding*2;
  var x = this.xPadding + (width/this.maxX * val);
  return x;
};

Chart.prototype.getYPixel = function(val) {
  var height = this.node.height - this.yPadding*2;
  var y = this.yPadding + (height/this.maxY * val);
  // console.log('getYPixel', val, y);
  return this.node.height - y;
};
Chart.prototype.plotSeries = function() {
  this.series.forEach(series => {
    if (!series.renderOptions) {
      series.renderOptions = {};
    }
    this._plotSeries(series);
  });
};

Chart.prototype._plotSeries = function(series) {
  var graph = this.node,
      ctx = graph.getContext('2d');
  var xPadding = this.xPadding;
  var yPadding = this.yPadding;
  var maxY = this.maxY;
  var minY = this.minY;
  var maxX = this.maxX;
  var minX = this.minX;

  ctx.lineWidth = 1;
  ctx.strokeStyle = series.renderOptions.lineColor || '#f99';

  // draw points
  ctx.beginPath();
  ctx.fillStyle = series.renderOptions.dotColor || '#f00';
  series.forEach((point, idx) => {
    var x = this.getXPixel(point.x);
    var y = this.getYPixel(point.y);
    if (idx > 0){
      ctx.lineTo(x, y);
    }
    ctx.moveTo(x, y);
  });
  ctx.stroke();
  series.forEach((point, idx) => {
    var x = this.getXPixel(point.x);
    var y = this.getYPixel(point.y);
    ctx.fillRect(x, y, 1, 1);
  });
};
Chart.prototype.render = function() {
  this.drawAxes();
  console.log('rendering with rangeX: ', this.minX, this.maxX, this.rangeX);
  console.log('rendering with rangeY: ', this.minY, this.maxY, this.rangeY);
  this.plotSeries();
}