const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

const Margin = require('../models/margin');
const Trade = require('../models/trade');
const Order = require('../models/order');

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

// Get orders
exports.getOrder = asyncHandler(async (req, res, next) => {
  // Fetch order all orders
  let orders = [];
  await client
    .marginAllOrders(req.body.pair)
    .then((response) => (orders = response.data))
    .catch((error) => client.logger.error(error));

  await Promise.all(
    orders.map(async (order) => {
      try {
        const oldOrder = await Order.findOne({ clientOrderId: order.clientOrderId });

        if (!oldOrder) {
          const newOrder = new Order(order);

          await newOrder.save();

          let trades = [];
          // Get trades from binance
          await client
            .marginMyTrades(`${newOrder.symbol}`, { orderId: `${newOrder.orderId}` })
            .then((response) => (trades = response.data))
            .catch((error) => client.logger.error(error));

          // Save trades to app database
          await Promise.all(
            trades.map(async (trade) => {
              // Get commission asset price
              if (trade.commissionAsset === 'USDT') {
                trade.commissionUsdt = trade.commission;
                trade.commissionAssetPrice = '1';
              } else {
                let commissionAssetPrice = '';
                await client
                  .tickerPrice(`${trade.commissionAsset}USDT`)
                  .then((response) => (commissionAssetPrice = response.data.price));

                trade.commissionAssetPrice = commissionAssetPrice;
                trade.commissionUsdt =
                  parseFloat(commissionAssetPrice) * parseFloat(trade.commission);
              }

              const newTrade = new Trade(trade);
              await newTrade.save();
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }),
  );

  const updatedOrders = await Order.find(
    { symbol: req.body.pair },
    'symbol orderId price origQty executedQty status type side time cummulativeQuoteQty ',
  )
    .sort({
      time: -1,
    })
    .exec();
  console.log(updatedOrders);
  res.json({ updatedOrders });
});

// Get order by name
exports.getOrderByName = asyncHandler(async (req, res, next) => {
  // Dynamically create a regular expression
  const regex = new RegExp(`^${req.body.pair}`);

  const orders = await Order.find(
    { symbol: regex },
    'symbol orderId price origQty executedQty status type side time cummulativeQuoteQty ',
  )
    .sort({
      time: -1,
    })
    .exec();

  res.json({ orders });
});

// Get user assets usdt value
exports.getUserAssetsUsdtValue = asyncHandler(async (req, res, next) => {
  let prices = [];

  // if req.body is empty return
  if (!req.body.assetsSymbolArray.length) {
    next();
  }
  await client
    .tickerPrice('', req.body.assetsSymbolArray)
    .then((response) => (prices = response.data));

  res.json({ prices });
});

// Get max borrowable usdt value
exports.getMaxBorrowableUsdt = asyncHandler(async (req, res, next) => {
  let maxBorrowableUsdt = {};
  await client
    .marginMaxBorrowable('USDT')
    .then((response) => (maxBorrowableUsdt = response.data))
    .catch((error) => client.logger.error(error));

  res.json(maxBorrowableUsdt);
});

// Get trades of an orderId
exports.getTrades = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  // Get trades from binance
  const trades = await Trade.find({ symbol: req.body.symbol, orderId: req.body.orderId })
    .sort({
      time: -1,
    })
    .exec();

  res.json({ trades });
});

// For development purposes
const getAllOrders = async () => {
  let orders = [];
  await client
    .marginAllOrders('AVAXUSDT')
    .then((response) => (orders = response.data))
    .catch((error) => client.logger.error(error));

  orders.forEach(async (order) => {
    const newOrder = new Order(order);
    try {
      await Order.findOneAndUpdate({ orderId: newOrder.orderId }, newOrder, {
        upsert: true, // If no document is found, create a new one
        new: true, // Return the updated document
      });
    } catch (error) {
      console.error(error);
    }
  });

  console.log(orders);
};

// getAllOrders();
