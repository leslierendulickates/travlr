const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function(req, res, next) {
  try {
    // Try different possible paths
    let tripsPath = path.join(__dirname, '../data/trips.json');
    console.log('Trying path 1:', tripsPath);

    if (!fs.existsSync(tripsPath)) {
      tripsPath = path.join(__dirname, '../../data/trips.json');
      console.log('Trying path 2:', tripsPath);
    }

    const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));
    console.log('Successfully loaded', trips.length, 'trips');

    res.render('travel', { 
      title: 'Travel - Bhaccasyoniztas Beach Resort', 
      trips: trips 
    });
  } catch (err) {
    console.error('Travel route error details:', err.message);
    res.status(500).send('<h2>Error loading travel page</h2><pre>' + err.message + '</pre><p>Check terminal for full details.</p>');
  }
});

module.exports = router;