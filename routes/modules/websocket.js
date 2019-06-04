let express = require('express');
let router = express.Router();
let loadRoutes = require('../loadRoutes').loadRoute;

loadRoutes('websocket', router);

module.exports = router;
