const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

const Margin = require('../models/margin');

const { binanceApiKey } = process.env;
const { binanceApiSecretKey } = process.env;

// Create client
const client = new Spot(binanceApiKey, binanceApiSecretKey);

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

  // Extract borrowed usdt from total balance
  const usdt = userMarginData.userAssets.filter((asset) => asset.asset === 'USDT');
  const netBalance =
    parseFloat(userMarginData.totalCollateralValueInUSDT) - parseFloat(usdt[0].borrowed);
  userMarginData.netBalance = `${netBalance}`;

  // Find all todays registration and delete them all
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    await Margin.deleteMany({
      date: {
        $gte: today, // Greater than or equal to the beginning of the day
        $lt: endOfDay, // Less than the end of the day
      },
    });
  } catch (error) {
    console.log('Could not delete;', error);
  }

  // Save user margin data

  const marginData = new Margin(userMarginData);
  try {
    await marginData.save();
  } catch (error) {
    console.error(error);
  }
  res.json(userMarginData);
});

// Get historic margin balances
exports.getBalances = asyncHandler(async (req, res, next) => {
  const balances = await Margin.find({}, 'netBalance totalNetAssetOfBtc date')
    .sort({
      date: 1,
    })
    .exec();

  res.json(balances);
});

// Get daily usdt margin balance
exports.getDailyUsdtBalance = asyncHandler(async (req, res, next) => {
  const dailyUsdtBalances = await Margin.find({}, 'netBalance date')
    .sort({
      date: 1,
    })
    .exec();

  res.json(dailyUsdtBalances);
});

// Get daily btc margin balance
exports.getDailyBtcBalance = asyncHandler(async (req, res, next) => {
  const dailyBtcBalances = await Margin.find({}, 'totalNetAssetOfBtc date')
    .sort({
      date: 1,
    })
    .exec();

  res.json(dailyBtcBalances);
});
