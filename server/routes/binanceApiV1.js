const express = require('express');

const router = express.Router();

const marginController = require('../controllers/marginController');

// Margin Routes
// Get margin user data
router.get('/margin/userData', marginController.getUserData);

module.exports = router;
