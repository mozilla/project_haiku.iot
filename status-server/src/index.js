var express = require('express');
var fs = require('fs');
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var argv = require('optimist').argv;
var serveIndex = require('serve-index');

var dataDir = path.join(__dirname, '../data');
var publicDir = path.join(__dirname, 'public');
var config = {
  port: 3000,
  prefix: 'api'
};
// mixin command-line args into our default config
Object.keys(config).forEach(function(name) {
  if (name in argv) {
    config[name] = argv[name];
  }
});
console.log('config', config);

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(publicDir));

//application/json: handles JSON requests based on the :id status number. reads file of status number provided and returns the data in json format
app.get('/api/user/:id/status.json', function(req, res){
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.json({ 'last-modified': (new Date(stats.mtime)).getTime(), value: status });
    });
  });
});
//text/plain: handles html requests based on :id, the status number. reads file of :id provided and renders html page with an update bar to update status
app.get('/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.set('Content-Type', 'text/html');
      res.send( htmlResponse({ prefix: '/' + config.prefix, path: req.path, name: 'status', value: status }));
    });
  });
});
//text/html
app.get('/user/:id/status.html', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.set('Content-Type', 'text/html');
      res.send( htmlResponse({ prefix: '/' + config.prefix, path: req.path, name: 'status', value: status }));
    });
  });
});
//handles the post request for status. writes data to prefix{id} file and updates html page with submitted data
app.post('/api/user/:id/status', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.json({ 'last-modified': stats.mtime, ok: true });
    });
  });
});

app.post('/api/user/:id/status.html', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.json({ 'last-modified': stats.mtime, ok: true });
    });
  });
});
//json extension route
app.post('/api/user/:id/status.json', function (req, res) {
  var num = req.params.id || 0;
  var filename = path.join(dataDir, 'status' + num);
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
      res.json({ 'last-modified': stats.mtime, ok: true });
    });
  });
});
app.use(serveIndex(publicDir, {'icons': true}));

app.listen(config.port, function () {
  console.log('Status app listening on port ' + config.port + '!');
});

function htmlResponse(ctxData) {
  var postTemplateHtml = '<!DOCTYPE html>\n' +
  '<html><head><title>%{name}</title></head>\n' +
  '<body>' +
  '<h1>%{name}: %{value}</h1>' +
  '<form action="%{prefix}%{path}" method="POST">' +
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
