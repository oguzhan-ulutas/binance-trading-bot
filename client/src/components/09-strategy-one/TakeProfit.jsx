import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import { v4 as uuidv4 } from "uuid";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

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
    errors,
    setErrors,
    messages,
    setMessages,
  } = useContext(StrategyOneContext);

  const [toStopLoss, setToStopLoss] = useState(0);

  const updateToTakeProfit = () => {
    if (order.side === "BUY") {
      setToTakeProfit(
        (
          parseFloat(order.takeProfitPrice) -
          parseFloat(assetArray[assetArray.length - 1])
        ).toFixed(3)
      );
    }

    if (order.side === "SELL") {
      setToTakeProfit(
        (
          parseFloat(assetArray[assetArray.length - 1]) -
          parseFloat(order.takeProfitPrice)
        ).toFixed(3)
      );
    }
  };

  const updateToStopLoss = () => {
    if (order.side === "SELL") {
      setToStopLoss(
        (
          parseFloat(order.stopOrderPrice) -
          parseFloat(assetArray[assetArray.length - 1])
        ).toFixed(3)
      );
    }

    if (order.side === "BUY") {
      setToStopLoss(
        (
          parseFloat(assetArray[assetArray.length - 1]) -
          parseFloat(order.stopOrderPrice)
        ).toFixed(3)
      );
    }
  };

  useEffect(() => {
    if (assetArray.length > 3) {
      updateToTakeProfit();
    }
  }, [assetArray]);

  // if toTakeProfit equal or smaller then zero set take profit to true
  const updateTakeProfit = async () => {
    if (parseFloat(toTakeProfit) <= 0) {
      await setTakeProfit(true);

      const message = {
        msgId: uuidv4(),
        msg: "Taking profit.",
        functionName: "Take Profit - updateTakeProfit",
      };
      setMessages([...messages, message]);
    }
  };

  useEffect(() => {
    updateTakeProfit();
  }, [toTakeProfit]);

  // if takeProfit true cancel open stop order

  useEffect(() => {
    if (takeProfit === true) {
      setTakeProfit(false);

      const message = {
        msgId: uuidv4(),
        msg: "Set takeProfit to false.",
        functionName:
          "Take Profit - If takeProfit true cancel open stop order.",
      };
      setMessages([...messages, message]);

      const url = `${serverUrl}/margin/strategy-one/take-profit`;
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
            const response = res.json();
            setErrors([...errors, ...response.errors]);
            return;
          }
          return res.json();
        })
        .then((res) => {
          console.log("TakeProfit - Cancel stop Order", res);
          const messagesCopy = [...messages];
          const updatedMessages = messagesCopy.map((order, index) => {
            if (order.orderId === res.order.orderId) {
              messagesCopy[index] = res.order;
              return messagesCopy;
            }
          });

          setOrder(res.order);
          setMessages(updatedMessages);
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
      <Typography variant="h4" gutterBottom>
        To Take Profit : {toTakeProfit} <br />
        To Stop Loss : {toStopLoss}
      </Typography>

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

      {/* <Button
        onClick={(asset, side, orderQuantity) => {
          placeOrder(asset, side, orderQuantity);
        }}
      >
        Set toTakeProfit
      </Button> */}
    </Box>
  );
};

export default TakeProfit;
