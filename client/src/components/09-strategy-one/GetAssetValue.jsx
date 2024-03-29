import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";

import { useContext, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import { StrategyOneContext } from "./StrategyOneContext";
import "./GetAssetValue.css";

const GetAssetValue = () => {
  const {
    serverUrl,
    assetValue,
    setAssetValue,
    asset,
    setAsset,
    assetArray,
    setAssetArray,
    isFetching,
    setIsFetching,
    errors,
    setErrors,
    messages,
    setMessages,
    isBotStarted,
    order,
  } = useContext(StrategyOneContext);

  // Get asset value each second

  const fetchAssetValue = async () => {
    const url = `${serverUrl}/margin/strategy-one/get-asset-value`;

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asset }),
      });

      const result = await response.json();

      await setAssetValue(parseFloat(result.price).toFixed(3));

      if (result.errors.length) {
        await setErrors([...errors, ...result.errors]);
      }
    } catch (error) {
      console.error("Error fetching data in GetAssetValue:", error);
    }
  };

  useEffect(() => {
    if (isFetching) {
      // Start fetching data if isFetching is true
      const intervalId = setInterval(() => {
        fetchAssetValue();
      }, 2000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isFetching]);

  useEffect(() => {
    setAssetArray([...assetArray, parseFloat(assetValue)]);
  }, [assetValue]);

  // Set messages for fetching
  useEffect(() => {
    isFetching
      ? setMessages([
          ...messages,
          {
            msgId: uuidv4(),
            msg: "Fetch asset value started.",
            functionName: "GetAssetValue - Set messages for fetching.",
          },
        ])
      : messages.length && !isFetching
      ? setMessages([
          ...messages,
          {
            msgId: uuidv4(),
            msg: "Fetch asset value stopped.",
            functionName: "GetAssetValue - Set messages for fetching.",
          },
        ])
      : null;
  }, [isFetching]);

  return (
    <Box className="startegy-one">
      <Box className="header-strategy-one">
        <TextField
          id="standard-basic"
          label="Pair"
          variant="standard"
          placeholder="BTCUSDT"
          defaultValue={"BTCUSDT"}
          onChange={(e) => {
            setAsset(e.target.value.toUpperCase());
            setAssetArray([]);
          }}
        />
        <Button
          variant="outlined"
          onClick={() =>
            isFetching ? setIsFetching(false) : setIsFetching(true)
          }
        >
          {isFetching ? "Stop Fetching Price" : "Start Fetching Price"}
        </Button>
        <Typography variant="h6" gutterBottom sx={{ display: "flex" }}>
          Stop Price: {order.orderId ? order.stopOrderPrice : 0}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: "0px 20px" }}
          />
          Current Price: {assetValue}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: "0px 20px" }}
          />
          Take Profit Price :{order.orderId ? order.takeProfitPrice : 0}
        </Typography>
      </Box>
    </Box>
  );
};

export default GetAssetValue;
