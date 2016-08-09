# Status

Publish status flags to the world, or subsets thereof.

This is a simple proof of concept to enable development of prototype clients which can consume status updates. The implementation consists of a single file-system backed 'status' attribute.


## Install

```
$ cd status-server
$ npm install
```


## Running Server

To run the server, enter the `status-server` directory and run:

```
$ npm start
```

We're using `nodemon` to watch for changes and the server will automatically restart when files change.


## HTTP API

#### `GET /user/:id/status`

Params:

  - `id` user id
 
Returns a JSON object with the following fields: 
  - `last-modified` the last time the status was modified
  - `value` the current value of the status
  
#### `PUT /user/:id/status`

Params:

  - `id` user id

Body: 

  - `status` the value to store

Returns a JSON object with the following fields: 
  - `last-modified` the last time the status was modified
  - `value` the current value of the status

#### `GET /user/:id/message`

Params:

  - `id` user id
   
Returns a JSON object with the following fields: 
  - `last-modified` the last time the message was modified
  - `value` the current value of the message
  - `sender` user id of sender
    
#### `PUT /user/:id/message`

Params:

  - `id` user id

Body: 

  - `message` the message to store
  - `sender` the sender id

Returns a JSON object with the following fields: 
  - `last-modified` the last time the message was modified
  - `value` the current value of the message
  - `sender` user id of sender
