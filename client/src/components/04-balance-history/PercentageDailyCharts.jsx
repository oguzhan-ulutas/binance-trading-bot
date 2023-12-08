import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";

import { BotContext } from "../BotContext";

const PercentageDailyCharts = () => {
  const [balanceUstd, setBalanceUsdt] = React.useState([]);
  const [balanceBtc, setBalanceBtc] = React.useState([]);
  const { serverUrl } = React.useContext(BotContext);

  React.useEffect(() => {
    const url = `${serverUrl}/margin/daily-usdt`;

    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("Error in percentage daily usdt fetch: ", err);
      });
  });

  return (
    <>
      <h2>Daily</h2>
    </>
  );
};

export default PercentageDailyCharts;
