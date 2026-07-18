// Bring in DB connection and the Trip schema
const mongoose = require('./db');
const Trip = require('./travlr');

// Read seed data from JSON file
const fs = require('fs');
const path = require('path');
const tripsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/trips.json'), 'utf8')
);

const seedDB = async () => {
  try {
    await Trip.deleteMany({});
    await Trip.insertMany(tripsData);
    console.log('Database seeded successfully with trips!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();