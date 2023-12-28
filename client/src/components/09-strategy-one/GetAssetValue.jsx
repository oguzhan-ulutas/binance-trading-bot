import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

const GetAssetValue = () => {
  const {
    serverUrl,
    assetValue,
    setAssetValue,
    asset,
    setAsset,
    assetArray,
    setAssetArray,
  } = useContext(StrategyOneContext);

  const [isFetching, setIsFetching] = useState(false);

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
      await setAssetValue(parseFloat(result.price).toFixed(2));
      console.log(assetValue);
    } catch (error) {
      console.error("Error fetching data in GetAssetValue:", error);
    }
  };

  useEffect(() => {
    if (isFetching) {
      // Start fetching data if isFetching is true
      const intervalId = setInterval(() => {
        fetchAssetValue();
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isFetching]);

  useEffect(() => {
    setAssetArray([...assetArray, assetValue]);
    console.log(assetArray);
  }, [assetValue]);

  return (
    <Box className="header-strategy">
      <TextField
        id="standard-basic"
        label="Pair"
        variant="standard"
        placeholder="BTCUSDT"
        defaultValue={"BTCUSDT"}
        onChange={(e) => setAsset(e.target.value.toUpperCase())}
      />
      <Button
        variant="outlined"
        onClick={() =>
          isFetching ? setIsFetching(false) : setIsFetching(true)
        }
      >
        {isFetching ? "Stop" : "Start"}
      </Button>
      <Typography variant="h6" gutterBottom>
        Current Price: {assetValue}
      </Typography>{" "}
    </Box>
  );
};

export default GetAssetValue;
