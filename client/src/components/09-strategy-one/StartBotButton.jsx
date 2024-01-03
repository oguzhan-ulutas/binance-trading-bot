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

  const startButtonActions = () => {
    console.log({ asset, side, orderType, orderQuantity });
    setIsBotStarted(true);
    placeOrder(asset, side, orderQuantity);
  };

  React.useEffect(() => {
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
          isFetching
            ? isBotStarted
              ? setIsBotStarted(false)
              : startButtonActions()
            : setOpen(true);
        }}
      >
        {isBotStarted ? "Stop Bot" : "Start Bot"}
      </Button>
    </Box>
  );
}
