// PSEUDOCODE
// - The aim of the strategy is making 0.5% profit for each trade.
// - The user will decide the trade direction(buy or sell)
// 1 - Fetch asset data each second and add price to an array.
// 2 - Open order, save order
// 3 - Set a stop order below or above to 0.5% of entry price
// 4 - Get open orders, if stopped do nothing
// 5 - If price reaches 0,5% of the entry point close stop order
// 6 - Open a sell order and take profit
// 7 - Open new order and repeat

import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import { useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import GetAssetValue from "./GetAssetValue";
import PlaceOrder from "./PlaceOrder";
import BotActionInfo from "./BotActionInfo";
import "./StrategyOne.css";
import TakeProfit from "./TakeProfit";

const StrategyOne = () => {
  const serverUrl = import.meta.env.VITE_serverUrl;

  const [assetValue, setAssetValue] = useState(0);
  const [asset, setAsset] = useState("BTCUSDT");
  const [assetArray, setAssetArray] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [side, setSide] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [isBotStarted, setIsBotStarted] = useState(false); // false
  const [order, setOrder] = useState({});
  const [toTakeProfit, setToTakeProfit] = useState(100); // A random positive number
  const [takeProfit, setTakeProfit] = useState(false); // false
  const [isStopped, setIsStopped] = useState(false);

  const placeOrder = (pair, side, quantity) => {
    const url = `${serverUrl}/margin/place-order`;
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair, side, quantity }),
    })
      .then((res) => {
        console.log(res);
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        if (res.status === "FILLED") {
          setOrder(res);
          console.log({ info: "Order Placed", order });
        }
        console.log(res);
      })
      .catch((err) => {
        console.log("Place order error: ", err);
      });
  };

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
        placeOrder,
        isBotStarted,
        setIsBotStarted,
        order,
        setOrder,
        toTakeProfit,
        setToTakeProfit,
        takeProfit,
        setTakeProfit,
        isStopped,
        setIsStopped,
      }}
    >
      <GetAssetValue />

      <Divider style={{ margin: "20px 0" }} />

      <div className="bot-info-div">
        <PlaceOrder />
        <Divider orientation="vertical" flexItem />
        <BotActionInfo />
      </div>

      <TakeProfit />

      <Divider style={{ margin: "20px 0" }} />
    </StrategyOneContext.Provider>
  );
};

export default StrategyOne;
