import Router from "./components/Router.jsx";
import { BotContext } from "./components/BotContext.jsx";

import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const serverUrl = import.meta.env.VITE_serverUrl;
  const [userMarginData, setMarginUserData] = useState({});

  // Set non-zero value assets as an array
  const userAssets = userMarginData.tradeEnabled
    ? userMarginData.userAssets
    : [];

  return (
    <BotContext.Provider
      value={{
        serverUrl,
        userMarginData,
        setMarginUserData,
        userAssets,
      }}
    >
      <Router />
    </BotContext.Provider>
  );
}

export default App;
