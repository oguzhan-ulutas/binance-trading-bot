const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

const Margin = require('../models/margin');

const { binanceApiKey } = process.env;
const { binanceApiSecretKey } = process.env;

// Create client
const client = new Spot(binanceApiKey, binanceApiSecretKey);

// console.log({ binanceApiKey, binanceApiSecretKey, client });

exports.getUserData = asyncHandler(async (req, res, next) => {
  let userMarginData = {};
  // Get margin user data
  await client
    .marginAccount()
    .then((response) => {
      userMarginData = { ...response.data };
    })
    .catch((error) => client.logger.error(error));
  // Filter zero value assets
  userMarginData = {
    ...userMarginData,
    userAssets: userMarginData.userAssets.filter((asset) => asset.netAsset != '0'),
  };
  console.log(userMarginData);
  // Save user margin data

  const marginData = new Margin(userMarginData);
  try {
    await marginData.save();
  } catch (error) {
    console.error(error);
  }
  res.json(userMarginData);
});
