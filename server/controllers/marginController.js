const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

const { binanceApiKey } = process.env;
const { binanceApiSecretKey } = process.env;

// Create client
const client = new Spot(binanceApiKey, binanceApiSecretKey);

// console.log({ binanceApiKey, binanceApiSecretKey, client });

exports.getUserData = asyncHandler(async (req, res, next) => {
  let userData = {};
  // Get margin user data
  await client
    .marginAccount()
    .then((response) => {
      userData = { ...response.data };
    })
    .catch((error) => client.logger.error(error));

  res.json(userData);
});
