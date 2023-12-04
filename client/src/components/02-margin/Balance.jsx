import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { BotContext } from "../BotContext";
import "./Balance.css";

const Balance = () => {
  const { userMarginData } = useContext(BotContext);
  return (
    <div className="balance-margin">
      <Typography variant="h4" gutterBottom>
        Margin
      </Typography>
      {userMarginData.totalCollateralValueInUSDT ? (
        <Typography variant="h6" gutterBottom>
          Tolal Balance: <br />{" "}
          {userMarginData.totalCollateralValueInUSDT.slice(0, 7)} USDT, <br />
          {userMarginData.totalAssetOfBtc} BTC
        </Typography>
      ) : null}
    </div>
  );
};

export default Balance;
