let express = require('express');
let router = express.Router();
let loadRoutes = require('../loadRoutes').loadRoute;

loadRoutes('account', router);

module.exports = router;
