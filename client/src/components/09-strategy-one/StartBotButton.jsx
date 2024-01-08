import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { StrategyOneContext } from "./StrategyOneContext";

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
  } = React.useContext(StrategyOneContext);

  React.useEffect(() => {
    if (isBotStarted) {
      placeOrder(asset, side, orderQuantity);
    }
  }, [isBotStarted]);

  React.useEffect(() => {
    // console.log("Set open use effect", { isFetching, isBotStarted });
    if (isFetching) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isFetching]);

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
