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


