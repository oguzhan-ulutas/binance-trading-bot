import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";

import { BotContext } from "../BotContext";
import PercentageDailyCharts from "./PercentageDailyCharts";

export default function BalanceHistoryChart() {
  const { serverUrl } = React.useContext(BotContext);
  const [balances, setBalances] = React.useState([]);

  React.useEffect(() => {
    const url = `${serverUrl}/margin/balance-history`;

    fetch(url, { made: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setBalances(res);
      })
      .catch((err) => {
        console.log("Balances fetch error in BalanceHistoryCart: ", err);
      });
  }, []);

  // extracting data to use in charts
  const dates = balances.map((item) => {
    // Extract year, month, and day from the date string
    const [year, month, day] = item.date.substring(0, 10).split("-");

    return new Date(year, month - 1, day);
  });

  const balancesUsdt = balances.map((item) => {
    return Number(item.netBalance);
  });

  const balancesBtc = balances.map((item) => Number(item.totalNetAssetOfBtc));

  const valueFormatter = (date) =>
    date.toLocaleDateString("fr-FR", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

  return (
    <>
      <h2>DAILY</h2>
      {dates.length > 0 ? (
        <div className="daily">
          <div className="balance-chart-usdt">
            <h2>Balance History(usdt)</h2>
            <LineChart
              xAxis={[
                {
                  data: dates,
                  scaleType: "time",
                  valueFormatter,
                  tickLabelInterval: (time) => time.getHours() === 0,
                },
              ]}
              series={[
                {
                  data: balancesUsdt,
                },
              ]}
              width={500}
              height={300}
            />
          </div>

          <Divider />

          <div className="balance-chart-btc">
            <h2>Balance History(btc)</h2>
            <LineChart
              xAxis={[
                {
                  data: dates,
                  scaleType: "time",
                  valueFormatter,
                  tickLabelInterval: (time) => time.getHours() === 0,
                },
              ]}
              series={[
                {
                  data: balancesBtc,
                },
              ]}
              width={500}
              height={300}
            />
          </div>

          <Divider />
          <PercentageDailyCharts dates={dates} />
        </div>
      ) : null}
    </>
  );
}
