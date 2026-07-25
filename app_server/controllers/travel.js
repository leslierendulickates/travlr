const Trip = require('../../app_api/models/travlr'); // Access the model from app_api

/* GET travel page. */
const travel = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();
    res.render('travel', {
      title: 'Travel - Travlr Getaways',
      trips: trips
    });
  } catch (err) {
    console.error('Error loading trips from database:', err.message);
    res.status(500).send('Error loading travel page: ' + err.message);
  }
};

module.exports = {
  travel
};
