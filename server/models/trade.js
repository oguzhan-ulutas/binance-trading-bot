const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const TradeSchema = new Schema({
  symbol: { type: String },
  id: { type: Number, unique: true },
  orderId: { type: Number },
  price: { type: String },
  qty: { type: String },
  quoteQty: { type: String },
  commission: { type: String },
  commissionAsset: { type: String },
  time: { type: Date },
  isBuyer: { type: Boolean },
  isMaker: { type: Boolean },
  isBestMatch: { type: Boolean },
  isIsolated: { type: Boolean },
});

module.exports = mongoose.model('Trade', TradeSchema);
