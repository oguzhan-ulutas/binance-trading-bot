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

import { useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import GetAssetValue from "./GetAssetValue";
import PlaceOrder from "./PlaceOrder";
import BotActionInfo from "./BotActionInfo";

const StrategyOne = () => {
  const serverUrl = import.meta.env.VITE_serverUrl;

  const [assetValue, setAssetValue] = useState(0);
  const [asset, setAsset] = useState("BTCUSDT");
  const [assetArray, setAssetArray] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [side, setSide] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [isBotStarted, setIsBotStarted] = useState(false);
  const [order, setOrder] = useState({
    _id: {
      $oid: "65902fa63d27523d5bc18251",
    },
    symbol: "BTCUSDT",
    orderId: 1,
    clientOrderId: "aF3txk5zrVZPRAzRXjMSld",
    transactTime: {
      $date: "2023-12-30T14:56:37.176Z",
    },
    price: "0",
    origQty: "0.00047",
    executedQty: "0.00047",
    status: "FILLED",
    timeInForce: "GTC",
    type: "MARKET",
    side: "SELL",
    isIsolated: false,
    selfTradePreventionMode: "EXPIRE_MAKER",
    fills: [
      {
        price: "42205.34",
        qty: "0.00047",
        commission: "0.00004674",
        commissionAsset: "BNB",
        tradeId: 3343367718,
      },
    ],
    bnbPrice: "318.06051252",
    cumulativeBnbCommission: "0.00",
    cumulativeUsdtCommission: "0.00",
    executedQtyUsdt: "19.84",
    entryPrice: "42212.77",
    stopOrderPrice: "42423.83",
    takeProfitPrice: "42001.71",
    stopOrder: {
      symbol: "BTCUSDT",
      orderId: 23988980451,
      clientOrderId: "Mi2xtUXwUpB7hAGUDbmOjy",
      transactTime: 1703948198396,
      price: "46666.21",
      origQty: "0.00047",
      executedQty: "0",
      cummulativeQuoteQty: "0",
      status: "NEW",
      timeInForce: "GTC",
      type: "STOP_LOSS_LIMIT",
      side: "BUY",
      fills: [],
      isIsolated: false,
      selfTradePreventionMode: "EXPIRE_MAKER",
    },
    __v: 0,
  });

  const placeOrder = (pair, side, orderType, quantity) => {
    const url = `${serverUrl}/margin/place-order`;
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair, side, orderType, quantity }),
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
          setOrder(res.entryPrice);
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
      }}
    >
      <GetAssetValue />
      <Divider style={{ margin: "20px 0" }} />
      <PlaceOrder />
      <Divider style={{ margin: "20px 0" }} />
      <BotActionInfo />
    </StrategyOneContext.Provider>
  );
};

export default StrategyOne;
