var express = require('express');
var fs = require('fs');
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var serveIndex = require('serve-index');

var dataDir = path.join(__dirname, '../data');
var publicDir = path.join(__dirname, 'public');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(publicDir));

app.get('/status\.:ext?', function (req, res) {
  var filename = path.join(dataDir, 'status');
  var ext = req.params.ext || '';
  fs.readFile(filename, function(err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error reading status!');
    }
    var status = buf.toString()
    fs.stat(filename, function(err, stats) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Error reading status last-modified!');
      }
      res.setHeader('Last-Modified', stats.mtime);
      switch (ext.toLowerCase()) {
        case 'json':
          res.json({ 'last-modified': (new Date(stats.mtime)).getTime(), value: status });
          break;
        case 'html':
          res.set('Content-Type', 'text/html');
          res.send( htmlResponse({ name: 'status', value: status }));
          break;
        default:
          res.send(status);
      }
    });

  });
});

app.post('/status\.:ext?', function (req, res) {
  var filename = path.join(dataDir, 'status');
  var ext = req.params.ext || '';
  var status = req.body.value;
  fs.writeFile(filename, status, function(err, buf) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Error updating status!');
    }
    fs.stat(filename, function(err, stats) {
      if (err) {
        console.error(err.stack);
        return res.status(500).send('Error reading status last-modified!');
      }
      res.setHeader('Last-Modified', stats.mtime);
      switch (ext.toLowerCase()) {
        case 'json':
          res.json({ 'last-modified': stats.mtime, ok: true });
          break;
        case 'html':
          res.set('Content-Type', 'text/html');
          res.send( htmlResponse({ name: 'status', value: status }));
          break;
        default:
          res.send('OK');
      }
    });

  });
});

app.use(serveIndex(publicDir, {'icons': true}));

app.listen(3000, function () {
  console.log('Status app listening on port 3000!');
});

function htmlResponse(ctxData) {
  var postTemplateHtml = '<!DOCTYPE html>\n' +
  '<html><head><title>%{name}</title></head>\n' +
  '<body>' +
  '<h1>%{name}: %{value}</h1>' +
  '<form action="/status.html" method="POST">' +
  '<input name="value" value="%{value}">' +
  '<input type="submit" value="Update">' +
  '</form></body></html>';

  var html = postTemplateHtml.replace(/\%\{([^\}]+)\}/g, function(m, name) {
    if (name in ctxData) {
      return ctxData[name];
    }
    return '';
  });
  return new Buffer(html);
}
