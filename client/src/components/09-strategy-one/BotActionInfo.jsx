import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { intlFormat } from "date-fns";

const BotActionInfo = () => {
  const { order, assetArray } = useContext(StrategyOneContext);
  const [toTarget, setToTarget] = useState(null);

  useEffect(() => {
    setToTarget(
      (
        parseFloat(order.takeProfitPrice) -
        parseFloat(assetArray[assetArray.length - 1])
      ).toFixed(2)
    );
  }, [assetArray]);

  return (
    <div className="bot-order-info">
      <Typography variant="h5" gutterBottom>
        BOT ACTIONS
        <br />
        {order.orderId ? (
          <Typography Typography variant="h6" gutterBottom>
            Order Placed at {order.entryPrice} Usdt.
            <br />
            {order.stopOrder.orderId ? "Stop order placed." : null}
            <br />
            {toTarget} usdt price change to target.
            <br />
            <strong>Order Size: </strong> {order.executedQtyUsdt} Usdt
            <br />
            <strong>Stop Price: </strong> {order.stopOrderPrice}
            <br />
            <strong>Take Profit Price: </strong> {order.takeProfitPrice}
            <br />
            <strong>Commission: </strong> {order.cumulativeUsdtCommission} Usdt
          </Typography>
        ) : (
          <p>Waiting for start of the bot</p>
        )}{" "}
      </Typography>
    </div>
  );
};

export default BotActionInfo;
