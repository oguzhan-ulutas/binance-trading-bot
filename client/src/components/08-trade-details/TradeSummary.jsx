import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "./TradeSummary.css";

const TradeSummary = ({ trades }) => {
  const asset = trades.length ? trades[0].symbol : "";

  const totalQty = trades.length
    ? trades.reduce((acc, trade) => (acc += parseFloat(trade.qty)), 0)
    : 0;

  const totalUsdtValue = trades.length
    ? trades.reduce((acc, trade) => (acc += parseFloat(trade.quoteQty)), 0)
    : 0;

  const totalCommissionUsdt = trades.length
    ? trades.reduce(
        (acc, trade) => (acc += parseFloat(trade.commissionUsdt)),
        0
      )
    : 0;

  return (
    <Box className="trade-info">
      <Box className="trade-summary">
        <Typography variant="h6" gutterBottom>
          Pair: {asset} <br />
          Tolal Trade Size: {totalQty}
          <br />
          Total Usdt Size: {totalUsdtValue.toFixed(2)}
          <br />
          Total commission: {totalCommissionUsdt.toFixed(2)} USDT
        </Typography>
      </Box>
    </Box>
  );
};

export default TradeSummary;
