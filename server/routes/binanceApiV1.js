const express = require('express');

const router = express.Router();

const marginController = require('../controllers/marginController');

// Margin Routes
// Get margin user data
router.get('/margin/userData', marginController.getUserData);

// Get historic margin balances
router.get('/margin/balance-history', marginController.getBalances);

module.exports = router;
