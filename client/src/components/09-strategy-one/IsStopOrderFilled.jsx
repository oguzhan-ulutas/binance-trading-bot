import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

const IsStopOrderFilled = () => {
  const {
    serverUrl,
    order,
    setOrder,
    assetValue,
    isBotStarted,
    isStopped,
    setIsStopped,
    setIsBotStarted,
    messages,
    setMessages,
  } = useContext(StrategyOneContext);

  const fetchStopOrder = () => {
    const url = `${serverUrl}/margin/strategy-one/is-stop-order-filled`;

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pair: order.symbol,
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
        console.log("IsStopOrderFilled", res);
        if (res.stopOrder.status === "FILLED") {
          setOrder(res.order);
          setMessages([...messages, ...res.messages]);
          setIsStopped(true);
          setIsBotStarted(false);
        }
      })
      .catch((err) => {
        console.log("Stop order fetch error in IsStopOrderFilled: ", err);
      });
  };

  useEffect(() => {
    if (order.orderId) {
      // If order exist
      if (order.side === "BUY") {
        if (parseFloat(assetValue) <= parseFloat(order.stopOrderPrice)) {
          fetchStopOrder();
        }
      } else {
        if (parseFloat(assetValue) >= parseFloat(order.stopOrderPrice)) {
          fetchStopOrder();
        }
      }

      // Set isStopped
      if (order.stopOrder.status !== "FILLED" && isStopped) {
        setIsStopped(false);
      }
    }
  }, [assetValue]);

  return (
    <Box>
      {isBotStarted ? (
        <Typography variant="h3" gutterBottom>
          {isStopped ? "Order stopped!!!" : "Not stopped yet!!!"}
        </Typography>
      ) : null}
      {/* <Button onClick={fetchStopOrder}>Stop Order Fetch</Button> */}
    </Box>
  );
};

export default IsStopOrderFilled;
