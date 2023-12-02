import Router from "./components/Router.jsx";
import { BotContext } from "./components/BotContext.jsx";

import "./App.css";
import { useState } from "react";

function App() {
  const serverUrl = import.meta.env.VITE_serverUrl;
  const [userMarginData, setMarginUserData] = useState({});

  return (
    <BotContext.Provider
      value={{ serverUrl, userMarginData, setMarginUserData }}
    >
      <Router />
    </BotContext.Provider>
  );
}

export default App;
