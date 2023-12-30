import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { StrategyOneContext } from "./StrategyOneContext";
import { useContext } from "react";

const OrderType = () => {
  const { orderType, setOrderType } = useContext(StrategyOneContext);

  const handleChange = (event) => {
    setOrderType(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Order Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={orderType}
          label="Order type"
          onChange={handleChange}
        >
          <MenuItem value={"LIMIT"}>LIMIT</MenuItem>
          <MenuItem value={"MARKET"}>MARKET</MenuItem>
          <MenuItem value={"STOP_LOSS"}>STOP_LOSS</MenuItem>
          <MenuItem value={"STOP_LOSS_LIMIT"}>STOP_LOSS_LIMIT</MenuItem>
          <MenuItem value={"TAKE_PROFIT"}>TAKE_PROFIT</MenuItem>
          <MenuItem value={"TAKE_PROFIT_LIMIT"}>TAKE_PROFIT_LIMIT</MenuItem>
          <MenuItem value={"LIMIT_MAKER"}>LIMIT_MAKER</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrderType;
