import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import "./OrderFetch.css";
import { BotContext } from "../BotContext";

const OrderFetch = ({ rows, setRows }) => {
  const [pair, setPair] = React.useState("BTCUSDT");
  const { serverUrl } = React.useContext(BotContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = `${serverUrl}/margin/get-order`;
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair }),
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        const newRows = [...rows];
        newRows.forEach((row) => {
          if (pair.startsWith(row.name)) {
            row.history = res.updatedOrders;
            setRows([...newRows]);
          }
        });
      })
      .catch((err) => {
        console.log("Trade fetch error: ", err);
      });
  };
  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="Pair"
          variant="standard"
          placeholder="BTCUSDT"
          defaultValue={"BTCUSDT"}
          onChange={(e) => setPair(e.target.value.toUpperCase())}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          Refresh Orders
        </Button>
      </Box>
    </>
  );
};

export default OrderFetch;
