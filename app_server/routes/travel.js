const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function(req, res, next) {
  try {
    const tripsPath = path.join(__dirname, '../../data/trips.json');
    const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));

    res.render('travel', { 
      title: 'Travel - Travlr Getaways', 
      trips: trips 
    });
  } catch (err) {
    console.error('Error loading trips:', err.message);
    res.status(500).send('Error loading travel page: ' + err.message);
  }
});

module.exports = router;