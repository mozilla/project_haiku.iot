'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var path = require('path');
var serveIndex = require('serve-index');

var app = express();
var dataDir = path.join(__dirname, '../data');
var publicDir = path.join(__dirname, 'public');
var config = {
  port: 3000
};

// FIXME: disabling this temporarily as it is causing all non-GET requests
// to return a 405 Method not allowed error
// app.use(serveIndex(publicDir, {'icons': true}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(publicDir));

app.get('/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);

  fs.readFile(filename, function (err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error reading status!');
    }

    fs.stat(filename, function (err, stats) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Error reading status last-modified!');
      }

      res.setHeader('Last-Modified', stats.mtime);
      res.json({ 'last-modified': stats.mtime, ok: true, value: buf.toString() });
    });
  });
});

app.put('/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
  var status = req.body.status;

  fs.writeFile(filename, status, function (err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error updating status!');
    }

    fs.stat(filename, function (err, stats) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Error reading status last-modified!');
      }

      res.setHeader('Last-Modified', stats.mtime);
      res.json({ 'last-modified': stats.mtime, ok: true, value: buf.toString() });
    });
  });
});

app.listen(config.port, function () {
  console.log('Status app listening on port ' + config.port + '!');
});
