import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { StrategyOneContext } from "./StrategyOneContext";
import { useContext } from "react";

const OrderQuantity = () => {
  const { orderQuantity, setOrderQuantity } = useContext(StrategyOneContext);

  const handleChange = (event) => {
    setOrderQuantity(event.target.value);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        label="Order Quantity (usdt)"
        variant="outlined"
        onChange={handleChange}
      />
    </Box>
  );
};

export default OrderQuantity;
