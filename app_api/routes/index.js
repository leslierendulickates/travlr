const express = require('express');
const router = express.Router();

// Controllers
const tripsController = require('../controllers/trips');

// Define route for trips endpoint
router
  .route('/trips')
  .get(tripsController.tripsList);

// Define route for single trip by code
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode);

module.exports = router;
