import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { BotContext } from "../BotContext";
import { v4 as uuidv4 } from "uuid";

const data = [];

const createData = (id, value, label) => {
  const asset = { id, value, label };
  data.push(asset);
};

export default function PieChartAssets() {
  const { userMarginData } = React.useContext(BotContext);
  const { userAssets } = userMarginData;

  userMarginData.tradeEnabled && userAssets[0].lastUsdtValue && !data.length
    ? userAssets.map((asset) => {
        const id = uuidv4();
        createData(id, parseFloat(asset.lastUsdtValue), asset.asset);
      })
    : null;

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
        },
      ]}
      height={400}
    />
  );
}
