import Router from "./components/Router.jsx";
import { BotContext } from "./components/BotContext.jsx";

import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const serverUrl = import.meta.env.VITE_serverUrl;
  const [userMarginData, setMarginUserData] = useState({});
  const [currentAssetsPrices, setCurrentAssetsPrices] = useState([]);

  // Set non-zero value assets as an array
  const userAssets = userMarginData.tradeEnabled
    ? userMarginData.userAssets
    : [];

  // Create an array of userAssets' symbol
  const assetsSymbolArray = userMarginData.tradeEnabled
    ? userAssets
        .filter((item) => item.asset !== "USDT")
        .map((item) => `${item.asset}USDT`)
    : [];

  console.log(currentAssetsPrices);

  return (
    <BotContext.Provider
      value={{
        serverUrl,
        userMarginData,
        setMarginUserData,
        userAssets,
        assetsSymbolArray,
        currentAssetsPrices,
        setCurrentAssetsPrices,
      }}
    >
      <Router />
    </BotContext.Provider>
  );
}

export default App;
