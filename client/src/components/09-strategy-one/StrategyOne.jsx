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
  const [isBotStarted, setIsBotStarted] = useState(false);
  const [order, setOrder] = useState(
    /**
     * Paste one or more documents here
     */
    {
      symbol: "BTCUSDT",
      orderId: 23988972039,
      clientOrderId: "82PSxPMo0oZ2oGYK5S7vZP",
      transactTime: {
        $date: "2023-12-30T14:55:02.923Z",
      },
      price: "0",
      origQty: "0.00047",
      executedQty: "0.00047",
      status: "FILLED",
      timeInForce: "GTC",
      type: "MARKET",
      side: "BUY",
      isIsolated: false,
      selfTradePreventionMode: "EXPIRE_MAKER",
      fills: [
        {
          price: "42187.18",
          qty: "0.00047",
          commission: "0.00004677",
          commissionAsset: "BNB",
          tradeId: 3343367087,
        },
      ],
      bnbPrice: "317.87201085",
      cumulativeBnbCommission: "0.00",
      cumulativeUsdtCommission: "0.00",
      executedQtyUsdt: "19.83",
      entryPrice: "42588.49",
      stopOrderPrice: "42360.53",
      takeProfitPrice: "42700.45",
      stopOrder: {
        symbol: "BTCUSDT",
        orderId: 23988972090,
        clientOrderId: "1zMcCElRy6eHWEeoFJ5GQc",
        transactTime: 1703948103700,
        price: "37782.48",
        origQty: "0.00047",
        executedQty: "0",
        cummulativeQuoteQty: "0",
        status: "NEW",
        timeInForce: "GTC",
        type: "STOP_LOSS_LIMIT",
        side: "SELL",
        fills: [],
        isIsolated: false,
        selfTradePreventionMode: "EXPIRE_MAKER",
      },
      __v: 0,
    }
  );
  const [toTarget, setToTarget] = useState(null);

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
        toTarget,
        setToTarget,
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
