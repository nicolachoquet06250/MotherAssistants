let express = require('express');
let router = express.Router();
let loadRoutes = require('../loadRoutes').loadRoute;

loadRoutes('children', router);

module.exports = router;
