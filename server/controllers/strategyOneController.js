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
  const errors = [];
  await client
    .tickerPrice(req.body.asset)
    .then((response) => (price = response.data.price))
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'getAssetValue';
      errorObject.url = '/margin/strategy-one/get-asset-value';
      errors.push(errorObject);
      console.log(error);
    });
  res.json({ price, errors });
});

// Place order
exports.placeOrder = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  let order = {};
  const errors = [];

  // Place order on binance
  await client
    .newMarginOrder(
      req.body.pair, // symbol
      req.body.side,
      'MARKET',
      {
        quoteOrderQty: parseFloat(req.body.quantity),
        newOrderRespType: 'FULL',
      },
    )
    .then((response) => {
      order = response.data;
    })
    .catch((error) => {
      errors.push(error);
      res.json({ order, errors });
    });

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
  order.executedQtyUsdt = executedQtyUsdt.toFixed(2);

  // Calculate entryPrice
  order.entryPrice = (parseFloat(order.executedQtyUsdt) / parseFloat(order.executedQty)).toFixed(2);

  // Calculate stop and take profit price
  const stopOrderPrice =
    req.body.side === 'BUY'
      ? (parseFloat(order.entryPrice) - parseFloat(order.entryPrice) * 0.005).toFixed(2)
      : (parseFloat(order.entryPrice) + parseFloat(order.entryPrice) * 0.005).toFixed(2);
  const takeProfitPrice =
    req.body.side === 'BUY'
      ? (parseFloat(order.entryPrice) + parseFloat(order.entryPrice) * 0.005).toFixed(2)
      : (parseFloat(order.entryPrice) - parseFloat(order.entryPrice) * 0.005).toFixed(2);

  order.stopOrderPrice = stopOrderPrice;
  order.takeProfitPrice = takeProfitPrice;

  // Add profit and loss
  order.profitAndLoss = 0;

  // Place a stop order
  const stopOrderSide = req.body.side === 'BUY' ? 'SELL' : 'BUY';
  const price =
    stopOrderSide === 'SELL'
      ? parseFloat(order.stopOrderPrice).toFixed(2) * 0.9
      : parseFloat(order.stopOrderPrice).toFixed(2) * 1.1;

  await client
    .newMarginOrder(
      req.body.pair, // symbol
      stopOrderSide,
      'STOP_LOSS_LIMIT',
      {
        quantity: parseFloat(order.executedQty),
        newOrderRespType: 'FULL',
        stopPrice: parseFloat(order.stopOrderPrice).toFixed(2),
        price: parseFloat(price).toFixed(2),
        timeInForce: 'GTC',
      },
    )
    .then((response) => {
      order.stopOrder = response.data;
    })
    .catch((error) => client.logger.error(error));

  // Create new BotOrder Instance
  const orderInstance = new BotOrder(order);

  try {
    const savedOrder = await orderInstance.save();
    console.log('Order saved successfully:', savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
  }

  res.json(orderInstance);
});

// Delete stop order and take profit
exports.takeProfit = asyncHandler(async (req, res, next) => {
  // Find order
  const order = await BotOrder.findOne({ orderId: req.body.orderId });

  // Cancel stop order
  await client
    .cancelMarginOrder(
      req.body.asset, // symbol
      {
        orderId: req.body.stopOrderId,
      },
    )
    .then((response) => (order.stopOrder = response.data))
    .catch((error) => client.logger.error(error));

  // Open Take Profit order
  const orderSide = order.side === 'BUY' ? 'SELL' : 'BUY';

  await client
    .newMarginOrder(
      order.symbol, // symbol
      orderSide,
      'MARKET',
      {
        quantity: parseFloat(order.executedQty),
        newOrderRespType: 'FULL',
      },
    )
    .then((response) => {
      order.takeProfitOrder = response.data;
    })
    .catch((error) => client.logger.error(error));

  if (order.takeProfitOrder.status === 'FILLED') {
    // Get current BNB price and add it to order object
    await client
      .marginPairIndex('BNBUSDT')
      .then((response) => {
        order.takeProfitOrder.bnbPrice = response.data.price;
      })
      .catch((error) => client.logger.error(error));

    // Calculate cumulative commission in bnb
    const cumulativeBnbCommission = await order.takeProfitOrder.fills.reduce(
      (acc, fill) => acc + parseFloat(fill.commission),
      0,
    );
    order.takeProfitOrder.cumulativeBnbCommission = cumulativeBnbCommission;

    // Calculate commission in usdt
    order.takeProfitOrder.cumulativeUsdtCommission =
      parseFloat(order.bnbPrice) * parseFloat(order.cumulativeBnbCommission);

    // Calculate executed qty in usdt
    const executedQtyUsdt = await order.takeProfitOrder.fills.reduce(
      (acc, fill) => acc + parseFloat(fill.price) * parseFloat(fill.qty),
      0,
    );
    order.takeProfitOrder.executedQtyUsdt = executedQtyUsdt;

    // Calculate profit
    order.profitAndLoss =
      order.side === 'BUY'
        ? parseFloat(order.cumulativeQuoteQty) -
          parseFloat(order.takeProfitOrder.cumulativeQuoteQty) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.takeProfitOrder.cumulativeUsdtCommission)
        : parseFloat(order.takeProfitOrder.cumulativeQuoteQty) -
          parseFloat(order.cumulativeQuoteQty) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.takeProfitOrder.cumulativeUsdtCommission);
  }

  // Find order and update on the database
  const updatedOrder = await BotOrder.findOneAndUpdate(
    { orderId: order.orderId },
    { $set: order },
    { new: true },
  );

  res.json(updatedOrder);
});

// Check if stop order filled
exports.isStopOrderFilled = asyncHandler(async (req, res, next) => {
  // Find order
  const order = await BotOrder.findOne({ orderId: req.body.orderId });

  // Fetch Stop order
  await client
    .marginOrder(req.body.pair, {
      origClientOrderId: 'xxwaqIhDz6E6VFsbRIzT9G',
    })
    .then((response) => (order.filledStopOrder = response.data))
    .catch((error) => client.logger.error(error));

  if (order.filledStopOrder.status === 'FILLED') {
    // Get current BNB price and add it to order object
    await client
      .marginPairIndex('BNBUSDT')
      .then((response) => {
        order.filledStopOrder.bnbPrice = response.data.price;
      })
      .catch((error) => client.logger.error(error));

    // Calculate cumulative commission in bnb
    const cumulativeBnbCommission = await order.filledStopOrder.fills.reduce(
      (acc, fill) => acc + parseFloat(fill.commission),
      0,
    );
    order.filledStopOrder.cumulativeBnbCommission = cumulativeBnbCommission;

    // Calculate commission in usdt
    order.filledStopOrder.cumulativeUsdtCommission =
      parseFloat(order.filledStopOrder.bnbPrice) *
      parseFloat(order.filledStopOrder.cumulativeBnbCommission);

    // Calculate executed qty in usdt
    const executedQtyUsdt = await order.filledStopOrder.fills.reduce(
      (acc, fill) => acc + parseFloat(fill.price) * parseFloat(fill.qty),
      0,
    );
    order.filledStopOrder.executedQtyUsdt = executedQtyUsdt;

    // Calculate loss
    order.profitAndLoss =
      order.side === 'BUY'
        ? parseFloat(order.cumulativeQuoteQty) -
          parseFloat(order.filledStopOrder.cumulativeQuoteQty) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.filledStopOrder.cumulativeUsdtCommission)
        : parseFloat(order.filledStopOrder.cumulativeQuoteQty) -
          parseFloat(order.cumulativeQuoteQty) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.filledStopOrder.cumulativeUsdtCommission);
  }

  // Find order and update on the database
  const updatedOrder = await BotOrder.findOneAndUpdate(
    { orderId: order.orderId },
    { $set: order },
    { new: true },
  );

  res.json(updatedOrder);
});
