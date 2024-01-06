import Router from "./components/Router.jsx";
import { BotContext } from "./components/BotContext.jsx";

import "./App.css";
import { useState } from "react";

function App() {
  const serverUrl = import.meta.env.VITE_serverUrl;
  const [userMarginData, setUserMarginData] = useState({});
  const [errors, setErrors] = useState([]);

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

  return (
    <BotContext.Provider
      value={{
        serverUrl,
        userMarginData,
        setUserMarginData,
        userAssets,
        assetsSymbolArray,
        errors,
        setErrors,
      }}
    >
      <Router />
    </BotContext.Provider>
  );
}

export default App;
