import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { BotContext } from "../BotContext";
import "./Balance.css";

const Balance = () => {
  const { userMarginData } = useContext(BotContext);

  // Display target
  const calculateTarget = () => {
    let capital = 10000;
    const year = new Date().getFullYear();
    for (let i = 2022; i <= year; i++) {
      capital = capital + capital * 0.5;
    }

    return `For year ${year} your target is ${capital} usd.`;
  };

  return (
    <div className="balance-margin">
      <Typography variant="h4" gutterBottom>
        MARGIN <br /> {calculateTarget()}
      </Typography>
      {userMarginData.totalCollateralValueInUSDT ? (
        <Typography variant="h6" gutterBottom>
          Tolal Balance: <br />{" "}
          {userMarginData.totalCollateralValueInUSDT.slice(0, 7)} USDT, <br />
          {userMarginData.totalAssetOfBtc} BTC <br />
        </Typography>
      ) : null}
    </div>
  );
};

export default Balance;
