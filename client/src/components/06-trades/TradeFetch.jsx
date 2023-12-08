import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import "./TradeFetch.css";
import { BotContext } from "../BotContext";

const TradeFetch = () => {
  const [pair, setPair] = React.useState("");
  const [trade, setTrade] = React.useState([]);
  const { serverUrl } = React.useContext(BotContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = `${serverUrl}/get-trade`;
    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setTrade(res);
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
        onSubmit={handleSubmit}
      >
        <TextField
          id="standard-basic"
          label="Pair"
          variant="standard"
          placeholder="BTCUSDT"
          onChange={(e) => setPair(e.target.value)}
        />
        <Button variant="outlined">Bring Last Trades</Button>
      </Box>
    </>
  );
};

export default TradeFetch;
