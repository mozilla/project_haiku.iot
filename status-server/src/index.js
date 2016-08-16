'use strict';
var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

var app = express();
var dataDir = path.join(__dirname, '../data');
var publicDir = path.join(__dirname, 'public');
var config = {
  port: process.env.PORT || 3000
};

// FIXME: disabling this temporarily as it is causing all non-GET requests
// to return a 405 Method not allowed error
// app.use(serveIndex(publicDir, {'icons': true}));

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(publicDir));

app.get('/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'user', num, 'status');

  fs.readFile(filename, function (err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error reading status!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(buf.toString());
  });
});

app.get('/user/:id/message', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'user', num, 'message');

  fs.readFile(filename, function (err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error reading message!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(buf.toString());
  });
});

app.get('/user/:id/slots', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'user', num, 'slots');

  fs.readFile(filename, function (err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error reading message!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(buf.toString());
  });
});

app.put('/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'user', num, 'status');
  var data = JSON.stringify({
    'last-modified': new Date(),
    value: req.body.value
  });

  fs.writeFile(filename, data, function (err) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error updating status!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.put('/user/:id/message', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'user', num, 'message');
  var data = JSON.stringify({
    'last-modified': new Date(),
    value: req.body.value,
    sender: req.body.sender
  });

  fs.writeFile(filename, data, function (err) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error updating message!');
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(config.port, function () {
  console.log('Status app listening on port ' + config.port + '!');
});
