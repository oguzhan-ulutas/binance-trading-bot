import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import "./PlaceOrder.css";
import OrderSide from "./OrderSide";
import OrderType from "./OrderType";
import OrderQuantity from "./OrderQuantity";
import StartBotButton from "./StartBotButton";

const PlaceOrder = () => {
  const {
    serverUrl,
    assetValue,
    asset,
    assetArray,
    isFetching,
    placeOrder,
    isBotStarted,
    setIsBotStarted,
  } = useContext(StrategyOneContext);

  return (
    <Box className="place-order">
      <Typography variant="h6" gutterBottom>
        Start Bot
      </Typography>
      <OrderSide />
      <OrderType />
      <OrderQuantity />
      <StartBotButton />
    </Box>
  );
};

export default PlaceOrder;
