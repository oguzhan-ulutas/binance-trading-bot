const express = require('express');

const router = express.Router();

const marginController = require('../controllers/marginController');

// Margin Routes
// Get margin user data
router.get('/margin/userData', marginController.getUserData);

// Get historic margin balances
router.get('/margin/balance-history', marginController.getBalances);

// Get daily usdt margin balance
router.get('/margin/daily-usdt', marginController.getDailyUsdtBalance);

// Get daily btc margin balance
router.get('/margin/daily-btc', marginController.getDailyBtcBalance);

// Get order
router.post('/margin/get-order', marginController.getOrder);

// Get order by name
router.post('/margin/orderbyname', marginController.getOrderByName);

// Get user assets usdt value
router.post('/margin/user-assets-usdt', marginController.getUserAssetsUsdtValue);

module.exports = router;
