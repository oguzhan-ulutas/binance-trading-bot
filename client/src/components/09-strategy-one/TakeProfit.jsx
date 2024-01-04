import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BotInfoTable from "./BotInfoTable";
import IsStopOrderFilled from "./IsStopOrderFilled";

const TakeProfit = () => {
  const {
    serverUrl,
    order,
    setOrder,
    assetArray,
    asset,
    side,
    orderQuantity,
    placeOrder,
    toTakeProfit,
    setToTakeProfit,
    takeProfit,
    setTakeProfit,
    setIsBotStarted,
  } = useContext(StrategyOneContext);

  const updateToTakeProfit = () => {
    if (order.side === "BUY") {
      setToTakeProfit(
        (
          parseFloat(order.takeProfitPrice) -
          parseFloat(assetArray[assetArray.length - 1])
        ).toFixed(2)
      );
    }

    if (order.side === "SELL") {
      setToTakeProfit(
        (
          parseFloat(assetArray[assetArray.length - 1]) -
          parseFloat(order.takeProfitPrice)
        ).toFixed(2)
      );
    }
  };

  useEffect(() => {
    if (assetArray.length > 3) {
      updateToTakeProfit();
    }
  }, [assetArray]);

  // if toTakeProfit equal or smaller then zero set take profit to true
  const updateTakeProfit = () => {
    if (parseFloat(toTakeProfit) <= 0) {
      setTakeProfit(true);
    }
  };

  useEffect(() => {
    updateTakeProfit();
  }, [toTakeProfit]);

  // if takeProfit true cancel open stop order

  useEffect(() => {
    console.log(takeProfit);
    if (takeProfit === true) {
      const url = `${serverUrl}/margin/take-profit`;
      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset,
          stopOrderId: order.stopOrder.orderId,
          orderId: order.orderId,
        }),
      })
        .then((res) => {
          if (res.status >= 400) {
            throw new Error("server error");
          }
          return res.json();
        })
        .then((res) => {
          setOrder(res);
          setTakeProfit(false);
          // Placing new order after taking profit
          placeOrder(asset, side, orderQuantity);
        })
        .catch((err) => {
          console.log("Place order error: ", err);
        });
    }
  }, [toTakeProfit]);

  return (
    <Box style={{ margin: "40px 0" }}>
      <Button
        variant="contained"
        color="error"
        size="large"
        sx={{
          fontSize: "25px",
          margin: "20px",
        }}
        onClick={() => setIsBotStarted(false)}
      >
        Emergency Stop Bot Button
      </Button>
      <Typography variant="h3" gutterBottom>
        To Take Profit : {toTakeProfit}
        <br />
        Take Profit : {takeProfit}
      </Typography>
      <IsStopOrderFilled />

      <Button
        onClick={() => {
          if (parseFloat(toTakeProfit) >= 0) {
            setToTakeProfit(-1);
            setTakeProfit(true);
          } else {
            setTakeProfit(1);
            setTakeProfit(false);
          }
        }}
      >
        Set toTakeProfit
      </Button>
      <BotInfoTable />
    </Box>
  );
};

export default TakeProfit;
