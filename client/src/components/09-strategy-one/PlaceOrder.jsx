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

const PlaceOrder = () => {
  const { serverUrl, assetValue, asset, assetArray, isFetching } =
    useContext(StrategyOneContext);

  console.log(asset, assetValue, assetArray);
  return (
    <Box className="place-order">
      <OrderSide />
      <OrderType />
      <OrderQuantity />
    </Box>
  );
};

export default PlaceOrder;
