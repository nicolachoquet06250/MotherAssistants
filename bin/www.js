#!/usr/bin/env node

/**
 * Module dependencies.
 */

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

let App = require('../app');
let app = App.app;
let port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

app.listen(port, '0.0.0.0');

let wsServer = new App.WebSocketServer({
  server: App.server,
  autoAcceptConnections: true
});

require('../modules/sockets/socket')(wsServer);
