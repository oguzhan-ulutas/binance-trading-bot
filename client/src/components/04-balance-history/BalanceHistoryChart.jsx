import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";
import { Box } from "@mui/material";

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
    return parseFloat(item.netBalance);
  });

  const balancesBtc = balances.map((item) =>
    parseFloat(item.totalNetAssetOfBtc)
  );

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
            <h2>Balance History</h2>
            <LineChart
              series={[
                {
                  data: balancesUsdt,
                  label: "USDT",
                  yAxisKey: "leftAxisId",
                  color: "#85BB65",
                },
                {
                  data: balancesBtc,
                  label: "BTC",
                  yAxisKey: "rightAxisId",
                  color: "#FF9900",
                },
              ]}
              xAxis={[
                {
                  data: dates,
                  scaleType: "time",
                  valueFormatter,
                  tickLabelInterval: (time) => time.getHours() === 0,
                  tickLabelStyle: {
                    angle: 310,
                    textAnchor: "end",
                    fontSize: 10,
                  },
                },
              ]}
              width={1000}
              height={500}
              yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
              rightAxis="rightAxisId"
            />
          </div>
          <Box my={5}>
            <Divider />
          </Box>

          <PercentageDailyCharts dates={dates} />
        </div>
      ) : null}
    </>
  );
}
