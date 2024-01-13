import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
        // Add fetch started msg
      }, 1000);
      // setMessages([
      //   ...messages,
      //   {
      //     msgId: uuidv4(),
      //     msg: "Fetch asset value started",
      //     functionName: "GetAssetValue",
      //   },
      // ]);

      // Clean up the interval on component unmount
      return () => {
        clearInterval(intervalId);
        // setMessages([
        //   ...messages,
        //   {
        //     msgId: uuidv4(),
        //     msg: "Fetch asset value stopped",
        //     functionName: "GetAssetValue",
        //   },
        // ]);
      };
    }
  }, [isFetching]);

  useEffect(() => {
    setAssetArray([...assetArray, parseFloat(assetValue)]);
  }, [assetValue]);

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
        <Typography variant="h6" gutterBottom>
          Current Price: {assetValue}
        </Typography>
      </Box>
    </Box>
  );
};

export default GetAssetValue;
