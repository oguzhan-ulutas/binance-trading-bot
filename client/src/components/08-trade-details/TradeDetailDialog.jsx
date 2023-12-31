import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import TradeDetailTable from "./TradeDetailTable";
import TradeSummary from "./TradeSummary";

import { BotContext } from "../BotContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TradeDetailDialog({ orderId, symbol }) {
  const { serverUrl } = React.useContext(BotContext);

  const [open, setOpen] = React.useState(false);

  const [trades, setTrades] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchTrades = () => {
    const url = `${serverUrl}/margin/trades`;
    fetch(url, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, symbol }),
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("Server error on trade detail dialog");
        }
        return res.json();
      })
      .then((res) => {
        setTrades(res.trades);
      })
      .catch((err) => {
        console.log("Fetch error on trade detail dialog: ", err);
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={() => {
          handleClickOpen();
          fetchTrades();
        }}
      >
        {orderId}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Trades
            </Typography>
          </Toolbar>
        </AppBar>
        <TradeSummary trades={trades} />
        <TradeDetailTable trades={trades} />
      </Dialog>
    </React.Fragment>
  );
}
