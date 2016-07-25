Status
======

Publish status flags to the world, or subsets thereof.

This is a simple proof of concept to enable development of prototype clients which can consume status updates. The implementation consists of a single file-system backed 'status' attribute. To publish this to the world (temporarily) maybe try https://www.spacekit.io/

Install
-------

```
cd status-server
npm install
```

Run
---

```
node src/index.js
```

Populate status
---------------

To update the value in the /status response, just edit the data/status file.
Or, load /status.html and click 'Update' to set the field value as your new status. Note the complete lack of any access control - this is a proof of concept remember.

Multiple status
---------------

To be able to work with two or more status, you can create status{n} files in the data directory (e.g. status0, status1) The /status route has been changed and now matches for /status0.json, /status1.json etc.

Startup parameters
------------------

The port the server listens on defaults to 3000, but can be configured by passing a --port parameter, for example

```
node src/index.js --port 8080
```

The filename prefix we use is 'status', i.e. the server expects to find files named status0, status1 etc in the data directory. That prefix can be changed using the --prefix parameter, for example:

```
node src/index.js --prefix foo
```

