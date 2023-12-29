// PSEUDOCODE
// - The aim of the strategy is making 0.5% profit for each trade.
// - The user will decide the trade direction(buy or sell)
// 1 - Fetch asset data each second and add price to an array.
// 2 - Open order, save order
// 3 - Set a trailing stop order below or above to 0.5% of entry price
// 4 - Get open orders, if stopped stop
// 5 - if price reaches %0,5 of entry price, cancel stop order and take profit
// 6 - Open new order and repeat

import Divider from "@mui/material/Divider";

import { useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import GetAssetValue from "./GetAssetValue";
import PlaceOrder from "./PlaceOrder";

const StrategyOne = () => {
  const serverUrl = import.meta.env.VITE_serverUrl;

  const [assetValue, setAssetValue] = useState(0);
  const [asset, setAsset] = useState("BTCUSDT");
  const [assetArray, setAssetArray] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [side, setSide] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  return (
    <StrategyOneContext.Provider
      value={{
        serverUrl,
        assetValue,
        setAssetValue,
        asset,
        setAsset,
        assetArray,
        setAssetArray,
        isFetching,
        setIsFetching,
        side,
        setSide,
        orderType,
        setOrderType,
        orderQuantity,
        setOrderQuantity,
      }}
    >
      <GetAssetValue />
      <Divider style={{ margin: "20px 0" }} />
      <PlaceOrder />
      <Divider style={{ margin: "20px 0" }} />
    </StrategyOneContext.Provider>
  );
};

export default StrategyOne;
