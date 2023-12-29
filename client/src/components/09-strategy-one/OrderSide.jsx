import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { StrategyOneContext } from "./StrategyOneContext";
import { useContext } from "react";

const OrderSide = () => {
  const { side, setSide } = useContext(StrategyOneContext);

  const handleChange = (event) => {
    setSide(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Side</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={side}
          label="Side"
          onChange={handleChange}
        >
          <MenuItem value={"BUY"}>BUY</MenuItem>
          <MenuItem value={"SELL"}>SELL</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default OrderSide;
