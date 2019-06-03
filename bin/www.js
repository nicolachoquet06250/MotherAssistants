#!/usr/bin/env node

/**
 * Module dependencies.
 */

let App = require('../app');
let app = App.app;
let server = App.server;

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port + 1);
require('../modules/sockets/socket')(App.io);

app.listen(port, '0.0.0.0');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
