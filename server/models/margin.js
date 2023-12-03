const mongoose = require('mongoose');

const { Schema } = mongoose;

const MarginSchema = new Schema({
  accountType: { type: String },
  tradeEnabled: { type: Boolean },
  transferEnabled: { type: Boolean },
  borrowEnabled: { type: Boolean },
  marginLevel: { type: String },
  totalAssetOfBtc: { type: String },
  totalLiabilityOfBtc: { type: String },
  totalNetAssetOfBtc: { type: String },
  collateralMarginLevel: { type: String },
  totalCollateralValueInUSDT: { type: String },
  date: { type: Date, default: Date.now },
  userAssets: { type: Array },
});

module.exports = mongoose.model('Margin', MarginSchema);
