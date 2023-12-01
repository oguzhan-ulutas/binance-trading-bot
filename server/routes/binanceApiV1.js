const express = require('express');

const router = express.Router();

const binanceController = require('../controllers/binanceController');

// Balance Routes
// Get balance
router.get('/balance', binanceController.getBalance);

module.exports = router;
