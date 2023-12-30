const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();

// const { response } = require('express');
const Margin = require('../models/margin');
const Trade = require('../models/trade');
const Order = require('../models/order');
const BotOrder = require('../models/botOrder');

const { binanceApiKey } = process.env;
const { binanceApiSecretKey } = process.env;

// Create client
const client = new Spot(binanceApiKey, binanceApiSecretKey);

// Get asset price
exports.getAssetValue = asyncHandler(async (req, res, next) => {
  let price = '';
  await client.tickerPrice(req.body.asset).then((response) => (price = response.data.price));
  res.json({ price });
});

// Place order
exports.placeOrder = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  let order = {};

  // Place order on binance
  await client
    .newMarginOrder(
      `${req.body.pair}`, // symbol
      `${req.body.side}`,
      `${req.body.orderType}`,
      {
        quoteOrderQty: `${parseFloat(req.body.quantity)}`,
        newOrderRespType: 'FULL',
      },
    )
    .then((response) => {
      order = response.data;
    })
    .catch((error) => client.logger.error(error));

  // Get current BNB price and add it to order object
  await client
    .marginPairIndex('BNBUSDT')
    .then((response) => {
      order.bnbPrice = response.data.price;
    })
    .catch((error) => client.logger.error(error));

  // Calculate cumulative commission in bnb
  const cumulativeBnbCommission = await order.fills.reduce(
    (acc, fill) => acc + parseFloat(fill.commission),
    0,
  );
  order.cumulativeBnbCommission = cumulativeBnbCommission;

  // Calculate commission in usdt
  order.cumulativeUsdtCommission =
    parseFloat(order.bnbPrice) * parseFloat(order.cumulativeBnbCommission);

  // Calculate executed qty in usdt
  const executedQtyUsdt = await order.fills.reduce(
    (acc, fill) => acc + parseFloat(fill.price) * parseFloat(fill.qty),
    0,
  );
  order.executedQtyUsdt = executedQtyUsdt;

  // Create new BotOrder Instance
  const orderInstance = new BotOrder(order);

  await orderInstance.save();

  res.json(orderInstance);
});
