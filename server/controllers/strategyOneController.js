const asyncHandler = require('express-async-handler');
const Spot = require('@binance/connector/src/spot');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

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
  const messages = [];

  await client
    .tickerPrice(req.body.asset)
    .then((response) => {
      price = response.data.price;
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Fetch asset value started.',
          functionName: 'getAssetValue',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'getAssetValue';
      errorObject.url = '/margin/strategy-one/get-asset-value';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
    });
  res.json({ price, errors, messages });
});

// Place order
exports.placeOrder = asyncHandler(async (req, res, next) => {
  let order = {};
  const errors = [];
  const messages = [];

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
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Order Placed',
          functionName: 'placeOrder - Place order on binance',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'placeOrder';
      errorObject.url = '/margin/strategy-one/place-order';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

  // Get current BNB price and add it to order object
  await client
    .marginPairIndex('BNBUSDT')
    .then((response) => {
      order.bnbPrice = response.data.price;
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'placeOrder - Fetch bnb price';
      errorObject.url = '/margin/strategy-one/place-order';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

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
  order.executedQtyUsdt = executedQtyUsdt.toFixed(3);

  // Calculate entryPrice
  order.entryPrice = (parseFloat(order.executedQtyUsdt) / parseFloat(order.executedQty)).toFixed(3);

  // Calculate stop and take profit price
  const stopOrderPrice =
    req.body.side === 'BUY'
      ? (parseFloat(order.entryPrice) - parseFloat(order.entryPrice) * 0.002).toFixed(3)
      : (parseFloat(order.entryPrice) + parseFloat(order.entryPrice) * 0.002).toFixed(3);
  const takeProfitPrice =
    req.body.side === 'BUY'
      ? (parseFloat(order.entryPrice) + parseFloat(order.entryPrice) * 0.002).toFixed(3)
      : (parseFloat(order.entryPrice) - parseFloat(order.entryPrice) * 0.002).toFixed(3);

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
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Stop order placed.',
          functionName: 'placeOrder - Place stop order',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'placeOrder - place stop order';
      errorObject.url = '/margin/strategy-one/place-order';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

  // Create new BotOrder Instance
  const orderInstance = new BotOrder(order);

  try {
    const savedOrder = await orderInstance.save();
    if (savedOrder) {
      const message = {
        msgId: uuidv4(),
        msg: 'Order saved to data base.',
        functionName: 'placeOrder - Create new order instance',
      };
      messages.push(message);
    }
  } catch (error) {
    const errorObject = error.response.data;
    errorObject.functionName = 'placeOrder';
    errorObject.url = '/margin/strategy-one/place-order - Saved order';
    errorObject.id = uuidv4();
    errors.push(errorObject);

    console.error('Error saving order:', error);
    res.json({ order: orderInstance, errors });
  }

  res.json({ order: orderInstance, errors, messages });
});

// Delete stop order and take profit
exports.takeProfit = asyncHandler(async (req, res, next) => {
  // Find order
  const order = await BotOrder.findOne({ orderId: req.body.orderId });
  const errors = [];
  const messages = [];

  // Cancel stop order
  await client
    .cancelMarginOrder(
      req.body.asset, // symbol
      {
        orderId: req.body.stopOrderId,
      },
    )
    .then((response) => {
      order.stopOrder = response.data;
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Stop order cancelled',
          functionName: 'takeProfit - Cancel stop order',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'takeProfit - cancel stop order';
      errorObject.url = '/margin/strategy-one/take-profit';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

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
      console.log('resp', response.data);
      console.log('takeProfit ', order);
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Take profit order placed.',
          functionName: 'takeProfit - Open Take Profit order.',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'takeProfit - open take profit order';
      errorObject.url = '/margin/strategy-one/take-profit';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

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
        ? parseFloat(order.executedQtyUsdt) -
          parseFloat(order.takeProfitOrder.executedQty) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.takeProfitOrder.cumulativeUsdtCommission)
        : parseFloat(order.takeProfitOrder.executedQtyUsdt) -
          parseFloat(order.executedQtyUsdt) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.takeProfitOrder.cumulativeUsdtCommission);
  }

  // Find order and update on the database
  const updatedOrder = await BotOrder.findOneAndUpdate(
    { orderId: order.orderId },
    { $set: order },
    { new: true },
  );

  if (updatedOrder) {
    const message = {
      msgId: uuidv4(),
      msg: 'Profit taken, and order saved the database.',
      functionName: 'takeProfit - Find order and update on the database',
    };
    messages.push(message);
  }

  res.json({ order: updatedOrder, errors, messages });
});

// Check if stop order filled
exports.isStopOrderFilled = asyncHandler(async (req, res, next) => {
  const messages = [];
  const errors = [];
  // Find order
  const order = await BotOrder.findOne({ orderId: req.body.orderId });

  // Fetch stop order
  await client
    .marginOrder(req.body.pair, {
      origClientOrderId: order.stopOrder.clientOrderId,
    })
    .then((response) => {
      order.stopOrder = response.data;
      if (response.status < 400) {
        const message = {
          msgId: uuidv4(),
          msg: 'Filled stop order fetched.',
          functionName: 'isStopOrderFilled - Fetch stop order.',
        };
        messages.push(message);
      }
    })
    .catch((error) => {
      const errorObject = error.response.data;
      errorObject.functionName = 'isStopOrderFilled - Fetch stop order';
      errorObject.url = '/margin/strategy-one/take-profit';
      errorObject.id = uuidv4();
      errors.push(errorObject);
      console.log(error);
      res.json({ order, errors });
    });

  if (order.stopOrder.status === 'FILLED') {
    // Get current BNB price and add it to order object
    // await client
    //   .marginPairIndex('BNBUSDT')
    //   .then((response) => {
    //     order.stopOrder.bnbPrice = response.data.price;
    //   })
    //   .catch((error) => client.logger.error(error));

    // Calculate commission in usdt
    order.stopOrder.cumulativeUsdtCommission =
      parseFloat(order.stopOrder.cumulativeQuoteQty) * 0.0075;

    // Calculate loss
    order.profitAndLoss =
      order.side === 'BUY'
        ? parseFloat(order.executedQtyUsdt) -
          parseFloat(order.stopOrder.executedQtyUsdt) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.stopOrder.cumulativeUsdtCommission)
        : parseFloat(order.stopOrder.executedQtyUsdt) -
          parseFloat(order.cexecutedQtyUsdt) -
          parseFloat(order.cumulativeUsdtCommission) -
          parseFloat(order.stopOrder.cumulativeUsdtCommission);

    console.log({ order, messages, errors });

    // Add message
    const message = {
      msgId: uuidv4(),
      msg: 'POSITION STOPPED.',
      functionName: 'isStopOrderFilled',
    };
    messages.push(message);
  }

  // Find order and update on the database
  const updatedOrder = await BotOrder.findOneAndUpdate(
    { orderId: order.orderId },
    { $set: order },
    { new: true },
  );

  res.json({ order: updatedOrder, messages, errors });
});
