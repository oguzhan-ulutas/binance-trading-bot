const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  symbol: { type: String },
  orderId: { type: Number },
  clientOrderId: { type: String, unique: true },
  price: { type: String },
  origQty: { type: String },
  executedQty: { type: String },
  cumulativeQuoteQty: { type: String },
  status: { type: String },
  timeInForce: { type: String },
  type: { type: String },
  side: { type: String },
  stopPrice: { type: String },
  icebergQty: { type: String },
  time: { type: Date },
  updateTime: { type: Date },
  isWorking: { type: Boolean },
  accountId: { type: Number },
  isIsolated: { type: Boolean },
  selfTradePreventionMode: { type: String },
});

module.exports = mongoose.model('Order', OrderSchema);
