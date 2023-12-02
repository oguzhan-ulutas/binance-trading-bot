import { useContext } from "react";

import Typography from "@mui/material/Typography";

import { BotContext } from "../BotContext";
import "./Balance.css";

const Balance = () => {
  const { userMarginData } = useContext(BotContext);
  return (
    <div className="balance-margin">
      <Typography variant="h4">Margin</Typography>
      <Typography variant="h6">
        Tolal Balance: <br />{" "}
        {userMarginData.totalCollateralValueInUSDT.slice(0, 7)} USDT, <br />
        {userMarginData.totalAssetOfBtc} BTC
      </Typography>
    </div>
  );
};

export default Balance;
