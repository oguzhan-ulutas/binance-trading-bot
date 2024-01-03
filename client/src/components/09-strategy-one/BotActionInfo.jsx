import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const BotActionInfo = () => {
  const { order, assetArray, toTarget, setToTarget } =
    useContext(StrategyOneContext);

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
      <Typography variant="h6" gutterBottom>
        Bot Actions
        <br />
        {order.orderId ? (
          <Typography variant="subtitle1" gutterBottom>
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
          <p>Waiting for start of the bot...</p>
        )}{" "}
      </Typography>
    </div>
  );
};

export default BotActionInfo;