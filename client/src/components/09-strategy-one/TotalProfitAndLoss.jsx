import { useContext, useEffect, useState } from "react";
import { StrategyOneContext } from "./StrategyOneContext";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const TotalProfitAndLoss = () => {
  const { orderArray, profitAndLoss, setProfitAndLoss } =
    useContext(StrategyOneContext);

  const [color, setColor] = useState("success");

  useEffect(() => {
    const sumProfitAndLoss = orderArray.reduce((acc, order) => {
      return acc + parseFloat(order.profitAndLoss);
    }, 0);

    setProfitAndLoss(sumProfitAndLoss.toFixed(3));
  }, [orderArray]);

  useEffect(() => {
    profitAndLoss >= 0 ? setColor("success") : setColor("error");
  }, [profitAndLoss]);

  return (
    <Stack>
      <h4>Total Profit And Loss: </h4>
      <Chip
        label={`${profitAndLoss} USDT`}
        variant="filled"
        size="medium"
        color={color}
      />
    </Stack>
  );
};

export default TotalProfitAndLoss;
