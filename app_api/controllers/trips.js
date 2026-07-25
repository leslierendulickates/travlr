const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model

// GET: /api/trips - list all trips
const tripsList = async (req, res) => {
  try {
    const q = await Trip.find({}).exec();
    if (!q || q.length === 0) {
      // Database returned no data
      return res.status(404).json({ message: 'No trips found' });
    }
    // Return the list of trips with HTTP 200 success status
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// GET: /api/trips/:tripCode - return a single trip
const tripsFindByCode = async (req, res) => {
  try {
    const q = await Trip.find({ code: req.params.tripCode }).exec();
    if (!q || q.length === 0) {
      // Database returned no data
      return res.status(404).json({ message: 'Trip not found' });
    }
    // Return the single trip found with HTTP 200 success status
    return res.status(200).json(q);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode
};
