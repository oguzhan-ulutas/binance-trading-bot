import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import OrderSide from "./OrderSide";

const PlaceOrder = () => {
  const { serverUrl, assetValue, asset, assetArray, isFetching } =
    useContext(StrategyOneContext);

  console.log(asset, assetValue, assetArray);
  return (
    <Box>
      <OrderSide />
    </Box>
  );
};

export default PlaceOrder;
