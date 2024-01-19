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

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { StrategyOneContext } from "./StrategyOneContext";
import GetAssetValue from "./GetAssetValue";
import PlaceOrder from "./PlaceOrder";
import BotActionInfo from "./BotOrderInfo";
import "./StrategyOne.css";
import TakeProfit from "./TakeProfit";
import Errors from "./Errors";
import BotMessages from "./BotMessages";
import BotInfoTable from "./BotInfoTable";
import IsStopOrderFilled from "./IsStopOrderFilled";
import TotalProfitAndLoss from "./TotalProfitAndLoss";

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
  const [orderCount, setOrderCount] = useState(1);
  const [toTakeProfit, setToTakeProfit] = useState(100); // A random positive number
  const [takeProfit, setTakeProfit] = useState(false); // false
  const [isStopped, setIsStopped] = useState(false);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [orderArray, setOrderArray] = useState([]);
  const [profitAndLoss, setProfitAndLoss] = useState(0);

  const placeOrder = (pair, side, quantity) => {
    const message = {
      msgId: uuidv4(),
      msg: "Sending new order request to server.",
      functionName: "StrategyOne - placeOrder.",
    };
    setMessages([...messages, message]);

    const url = `${serverUrl}/margin/strategy-one/place-order`;
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair, side, quantity }),
    })
      .then((res) => {
        if (res.status >= 400) {
          const response = res.json();
          setErrors([...errors, ...response.errors]);
          return;
        }
        return res.json();
      })
      .then((res) => {
        console.log("placeOrder -->", res);
        setOrder(res.order);
        setMessages([...messages, ...res.messages]);
        console.log(res);

        if (res.errors.length) {
          setErrors([...errors, ...res.errors]);
        }
      })
      .catch((err) => {
        console.log("Place order error: ", err);
      });
  };

  // Set orderArray
  useState(() => {
    if (orderArray.length === 0) {
      const newItem = { orderCount, order };
      setOrderArray([newItem]);
      setOrderCount(orderCount + 1);
    } else {
      const orderArrayCopy = [...orderArray];
      orderArrayCopy.map((oldOrder, index, arr) => {
        if (oldOrder.orderId === order.orderId) {
          orderArrayCopy[index].order = order;
          setOrderArray([...orderArrayCopy]);
        } else {
          const newItem = { orderCount, order };
          setOrderArray([...orderArray, newItem]);
          setOrderCount(orderCount + 1);
        }
      });
    }
  }, [order]);

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
        errors,
        setErrors,
        messages,
        setMessages,
        orderArray,
        setOrderArray,
        profitAndLoss,
        setProfitAndLoss,
      }}
    >
      <Errors />
      <Divider style={{ margin: "20px 0" }} />

      <GetAssetValue />

      <Divider style={{ margin: "20px 0" }} />

      <TakeProfit />

      <Divider style={{ margin: "20px 0" }} />

      <IsStopOrderFilled />

      <Divider style={{ margin: "20px 0" }} />

      <TotalProfitAndLoss />

      <Divider style={{ margin: "20px 0" }} />

      <div className="bot-info-div">
        <PlaceOrder />
        <Divider orientation="vertical" flexItem />
        <BotActionInfo />
        <Divider orientation="vertical" flexItem />
        <BotMessages />
      </div>

      <Divider style={{ margin: "20px 0" }} />

      <BotInfoTable />

      <Divider style={{ margin: "20px 0" }} />
    </StrategyOneContext.Provider>
  );
};

export default StrategyOne;
