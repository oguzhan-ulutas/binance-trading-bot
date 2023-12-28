const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

const { response } = require('express');
const Margin = require('../models/margin');
const Trade = require('../models/trade');
const Order = require('../models/order');

const { binanceApiKey } = process.env;
const { binanceApiSecretKey } = process.env;

// Create client
const client = new Spot(binanceApiKey, binanceApiSecretKey);

// Get asset price
exports.getAssetValue = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  let price = '';
  await client.tickerPrice(req.body.asset).then((response) => (price = response.data.price));
  res.json({ price });
});
