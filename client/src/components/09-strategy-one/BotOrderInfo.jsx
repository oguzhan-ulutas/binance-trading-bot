import { useContext, useEffect, useState, Fragment } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -7,
    top: 22,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "4px 4px",
  },
}));

const BotActionInfo = () => {
  const { orderArray } = useContext(StrategyOneContext);

  return (
    <Box sx={{ width: "100%" }}>
      <StyledBadge badgeContent={orderArray.length} color="primary">
        <h2>Bot Orders</h2>
      </StyledBadge>

      <Stack
        spacing={2}
        divider={<Divider flexItem />}
        direction="column-reverse"
        sx={{
          height: "400px",
          overflow: "auto",
        }}
      >
        {orderArray.length ? (
          orderArray.map((item) => {
            return (
              <Fragment key={item.order.clientOrderId}>
                <Item>
                  <Typography
                    key={item.order.clientOrderId}
                    variant="caption"
                    gutterBottom
                  >
                    <strong> Order Number: {item.orderCount}</strong> <br />
                    <strong> Pair : </strong> {item.order.symbol} <br />
                    <strong> Order Status : </strong> {item.order.status} <br />
                    <strong> Stop Order Status : </strong>{" "}
                    {item.order.stopOrder.status} <br />
                    <strong> Size : </strong> {item.order.executedQty} <br />
                    <strong> Size Usdt : </strong> ${item.order.executedQtyUsdt}{" "}
                    <br />
                    <strong> Entry Price : </strong> {item.order.entryPrice}{" "}
                    <br />
                    <strong> Stop Price : </strong> {item.order.stopOrderPrice}{" "}
                    <br />
                    <strong> Take Profit Price :</strong>{" "}
                    {item.order.takeProfitPrice} <br />
                    <strong> Profit and Loss :</strong>{" "}
                    {item.order.profitAndLoss} <br />
                  </Typography>
                </Item>
              </Fragment>
            );
          })
        ) : (
          <h1>Waiting for bot to start</h1>
        )}
      </Stack>
    </Box>
  );
};

export default BotActionInfo;
