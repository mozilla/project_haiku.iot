'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var serveIndex = require('serve-index')
var path = require('path');
var fs = require('fs');

var app = express();
var config = {
  port: process.env.PORT || 3000
};

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/logs/index.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var files = [];
  fs.readdir(path.join(__dirname, '../public/logs'), function(err, _files) {
    if (err) {
      throw err;
    }
    files = _files.filter(function(name) {
      return name.endsWith('.json');
    });
    res.json(files);
  })
});
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', serveIndex(path.join(__dirname, '../public'), {'icons': true}))

app.listen(config.port, function () {
  console.log('Status app listening on port ' + config.port + '!');
});
