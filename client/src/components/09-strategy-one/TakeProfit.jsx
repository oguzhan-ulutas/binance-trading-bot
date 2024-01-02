import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BotInfoTable from "./BotInfoTable";

const TakeProfit = () => {
  const { serverUrl, order, setOrder, assetArray, asset } =
    useContext(StrategyOneContext);
  const [toTakeProfit, setToTakeProfit] = useState(100); // A random positive number
  const [takeProfit, setTakeProfit] = useState(false); // false

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
      const url = `${serverUrl}/margin/delete-stop-order`;
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
        })
        .catch((err) => {
          console.log("Place order error: ", err);
        });
    }
  }, [toTakeProfit]);

  return (
    <Box style={{ margin: "40px 0" }}>
      <Typography variant="h3" gutterBottom>
        To Take Profit : {toTakeProfit}
        <br />
        Take Profit : {takeProfit}
      </Typography>
      <Typography variant="caption" gutterBottom>
        Nan
      </Typography>
      {/* <Button
        onClick={() => {
          setTakeProfit(true);
          setToTakeProfit(toTakeProfit + 1);
        }}
      >
        Set toTakeProfit
      </Button> */}
      <BotInfoTable />
    </Box>
  );
};

export default TakeProfit;
