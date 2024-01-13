const express = require('express');

const router = express.Router();

const marginController = require('../controllers/marginController');
const strategyOneController = require('../controllers/strategyOneController');

// MARGIN ROUTES
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
router.post('/margin/order-by-name', marginController.getOrderByName);

// Get user assets usdt value
router.post('/margin/user-assets-usdt', marginController.getUserAssetsUsdtValue);

// Get max borrowable usdt value
router.get('/margin/max-borrowable-usdt', marginController.getMaxBorrowableUsdt);

// Get trades of an orderId
router.post('/margin/trades', marginController.getTrades);

// STRATEGY ONE ROUTES
// Get asset price
router.post('/margin/strategy-one/get-asset-value', strategyOneController.getAssetValue);

// Place order
router.post('/margin/strategy-one/place-order', strategyOneController.placeOrder);

// Delete Stop Order
router.post('/margin/strategy-one/take-profit', strategyOneController.takeProfit);

// Fetch Stop order
router.post('/margin/is-stop-order-filled', strategyOneController.isStopOrderFilled);

module.exports = router;
