const express = require('express');
const router = express.Router();

const travelRouter = require('./travel');   // ← This is failing

router.use('/', require('./home') || something); // other routes
router.use('/travel', travelRouter);   // ← Important

module.exports = router;