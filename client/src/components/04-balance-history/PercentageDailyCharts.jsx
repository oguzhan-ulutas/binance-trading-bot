import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Divider from "@mui/material/Divider";

import { BotContext } from "../BotContext";

const PercentageDailyCharts = ({ dates }) => {
  const [balanceUsdt, setBalanceUsdt] = React.useState([]);
  const [balanceBtc, setBalanceBtc] = React.useState([]);
  const { serverUrl } = React.useContext(BotContext);

  // Fetch usdt balance
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
        setBalanceUsdt(res);
      })
      .catch((err) => {
        console.log("Error in percentage daily usdt fetch: ", err);
      });
  }, []);

  // Fetch usdt balance
  React.useEffect(() => {
    const url = `${serverUrl}/margin/daily-btc`;

    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setBalanceBtc(res);
      })
      .catch((err) => {
        console.log("Error in percentage daily btc fetch: ", err);
      });
  }, []);

  const valueFormatter = (date) =>
    date.toLocaleDateString("fr-FR", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

  const dataUsdt = balanceUsdt.map((item) => item.netBalance);
  const dataBtc = balanceBtc.map((item) => item.totalNetAssetOfBtc);

  function calculateDailyPercentageChange(balances) {
    const percentageChanges = ["0"];

    for (let i = 1; i < balances.length; i++) {
      const currentBalance = parseFloat(balances[i]);
      const previousBalance = parseFloat(balances[i - 1]);

      if (!isNaN(currentBalance) && !isNaN(previousBalance)) {
        const percentageChange =
          ((currentBalance - previousBalance) / previousBalance) * 100;
        percentageChanges.push(percentageChange.toFixed(2));
      } else {
        percentageChanges.push("N/A"); // Handle NaN values if encountered
      }
    }

    return percentageChanges;
  }

  const percentageUsdt = calculateDailyPercentageChange(dataUsdt);
  const percentageBtc = calculateDailyPercentageChange(dataBtc);

  return (
    <>
      {percentageUsdt.length > 0 && percentageBtc.length > 0 ? (
        <>
          <div className="balance-chart-usdt">
            <h2>Daily Change USDT(%)</h2>

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
                  data: percentageUsdt,
                },
              ]}
              width={500}
              height={300}
            />
          </div>

          <Divider />

          <div className="balance-chart-usdt">
            <h2>Daily Change BTC(%)</h2>
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
                  data: percentageBtc,
                },
              ]}
              width={500}
              height={300}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export default PercentageDailyCharts;
