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

To be able to work with two or more status, just you need to start the server with a specific status (eg: status1, status0) and different port.
We know the default port is 3000, you can use 4000 for example to start the second one and sure in different terminal.

```
node src\index.js --filename port 4000
```
