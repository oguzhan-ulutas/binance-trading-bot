import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { StrategyOneContext } from "./StrategyOneContext";

import { v4 as uuidv4 } from "uuid";

export default function StartBotButton() {
  const [open, setOpen] = React.useState(null);
  const {
    isFetching,
    isBotStarted,
    setIsBotStarted,
    asset,
    side,
    orderType,
    orderQuantity,
    placeOrder,
    takeProfit,
    messages,
    setMessages,
  } = React.useContext(StrategyOneContext);

  React.useEffect(() => {
    if (isBotStarted && !takeProfit) {
      placeOrder(asset, side, orderQuantity);
    }
  }, [isBotStarted, takeProfit]);

  React.useEffect(() => {
    if (isFetching) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isFetching]);

  // Set messages for isBotStarted
  React.useEffect(() => {
    isBotStarted
      ? setMessages([
          ...messages,
          {
            msgId: uuidv4(),
            msg: "Bot started.",
            functionName: "StartBotButton",
          },
        ])
      : setMessages([
          ...messages,
          {
            msgId: uuidv4(),
            msg: "Bot stopped.",
            functionName: "StartBotButton",
          },
        ]);
  }, [isBotStarted]);

  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Start fetching price first!!!
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          // console.log("start button", { isFetching, isBotStarted });
          isFetching
            ? isBotStarted
              ? setIsBotStarted(false)
              : setIsBotStarted(true)
            : setOpen(true);
        }}
      >
        {isBotStarted ? "Stop Bot" : "Start Bot"}
      </Button>
    </Box>
  );
}
