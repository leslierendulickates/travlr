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

// POST: /api/trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
  const newTrip = new Trip({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });

  try {
    const q = await newTrip.save();
    return res.status(201).json(q);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// PUT: /api/trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
  // Uncomment for debugging
  console.log(req.params);
  console.log(req.body);

  try {
    const q = await Trip
      .findOneAndUpdate(
        { 'code': req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true }
      )
      .exec();

    if (!q) {
      // Database returned no data
      return res
        .status(404)
        .json({ message: 'Trip not found for code ' + req.params.tripCode });
    } else {
      // Return resulting updated trip
      return res
        .status(201)
        .json(q);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

// DELETE: /api/trips/:tripCode - Deletes a Trip (optional)
const tripsDeleteTrip = async (req, res) => {
  try {
    const q = await Trip
      .findOneAndDelete({ 'code': req.params.tripCode })
      .exec();

    if (!q) {
      return res
        .status(404)
        .json({ message: 'Trip not found for code ' + req.params.tripCode });
    }
    return res.status(200).json(q);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};
