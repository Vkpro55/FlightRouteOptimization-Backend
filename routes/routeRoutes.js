const express = require('express');
const { getRouteDetails } = require('../controllers/routeController');

const router = express.Router();

router.post('/calculate', getRouteDetails);

module.exports = router;
