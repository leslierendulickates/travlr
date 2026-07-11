const express = require('express');
const router = express.Router();

const travelRouter = require('./travel');


router.get('/', (req, res) => res.redirect('/travel'));
router.use('/travel', travelRouter);


router.get('/rooms', (req, res) => res.sendFile('rooms.html', { root: './public' })); // example if you want

module.exports = router;