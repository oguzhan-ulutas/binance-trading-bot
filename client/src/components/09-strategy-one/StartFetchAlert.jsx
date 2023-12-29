import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { StrategyOneContext } from "./StrategyOneContext";

export default function StartFetchAlert() {
  const [open, setOpen] = React.useState(true);
  const { isFetching, isBotStarted, setIsBotStarted } =
    React.useContext(StrategyOneContext);

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
              : setIsBotStarted(true)
            : setOpen(true);
        }}
      >
        {isBotStarted ? "Stop Bot" : "Start Bot"}
      </Button>
    </Box>
  );
}
