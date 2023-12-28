import { useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";
import GetAssetValue from "./GetAssetValue";

const StrategyOne = () => {
  const serverUrl = import.meta.env.VITE_serverUrl;

  const [assetValue, setAssetValue] = useState(0);
  const [asset, setAsset] = useState("BTCUSDT");
  return (
    <StrategyOneContext.Provider
      value={{ serverUrl, assetValue, setAssetValue, asset, setAsset }}
    >
      <GetAssetValue />
    </StrategyOneContext.Provider>
  );
};

export default StrategyOne;
