const mongoose = require('mongoose');

const { Schema } = mongoose;

const BotOrderSchema = new Schema({
  symbol: { type: String },
  orderId: { type: Number },
  clientOrderId: { type: String, unique: true },
  transactTime: { type: Date },
  price: { type: String },
  origQty: { type: String },
  executedQty: { type: String },
  cumulativeQuoteQty: { type: String },
  status: { type: String },
  timeInForce: { type: String },
  type: { type: String },
  side: { type: String },
  marginBuyBorrowAmount: { type: Number }, // will not return if no margin trade happens
  marginBuyBorrowAsset: { type: String }, // will not return if no margin trade happens
  isIsolated: { type: Boolean },
  stopPrice: { type: String },
  icebergQty: { type: String },
  time: { type: Date },
  updateTime: { type: Date },
  isWorking: { type: Boolean },
  accountId: { type: Number },
  selfTradePreventionMode: { type: String },
  fills: { type: Array },
  bnbPrice: { type: String },
  cumulativeBnbCommission: { type: String },
  cumulativeUsdtCommission: { type: String },
  executedQtyUsdt: { type: String },
  entryPrice: { type: String },
  stopOrderPrice: { type: String },
  takeProfitPrice: { type: String },
});

module.exports = mongoose.model('BotOrder', BotOrderSchema);
