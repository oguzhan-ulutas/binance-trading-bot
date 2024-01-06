import { useContext, useEffect, useState } from "react";

import { StrategyOneContext } from "./StrategyOneContext";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const BotActionInfo = () => {
  const { order, assetArray } = useContext(StrategyOneContext);
  const [orderArray, setOrderArray] = useState([]);

  // const [orderArray, setOrderArray] = useState([
  //   {
  //     orderCount: 1,
  //     order: {
  //       _id: {
  //         $oid: "659569d05183a50b490d48b9",
  //       },
  //       symbol: "BTCUSDT",
  //       orderId: 24051370554,
  //       clientOrderId: "4BAOgqUTfsI1gXIHTFapsn",
  //       transactTime: {
  //         $date: "2024-01-03T14:06:07.452Z",
  //       },
  //       price: "0",
  //       origQty: "0.00047",
  //       executedQty: "0.00047",
  //       status: "FILLED",
  //       timeInForce: "GTC",
  //       type: "MARKET",
  //       side: "SELL",
  //       isIsolated: false,
  //       selfTradePreventionMode: "EXPIRE_MAKER",
  //       fills: [
  //         {
  //           price: "42380.71",
  //           qty: "0.00047",
  //           commission: "0.00004804",
  //           commissionAsset: "BNB",
  //           tradeId: 3349762666,
  //         },
  //       ],
  //       bnbPrice: "310.68368939",
  //       cumulativeBnbCommission: "0.00004804",
  //       cumulativeUsdtCommission: "0.0149252444382956",
  //       executedQtyUsdt: "19.92",
  //       entryPrice: "42382.98",
  //       stopOrderPrice: "42594.89",
  //       takeProfitPrice: "42171.07",
  //       stopOrder: {
  //         symbol: "BTCUSDT",
  //         orderId: 24051371112,
  //         clientOrderId: "xxwaqIhDz6E6VFsbRIzT9G",
  //         transactTime: 1704290768458,
  //         price: "46854.38",
  //         origQty: "0.00047",
  //         executedQty: "0",
  //         cummulativeQuoteQty: "0",
  //         status: "NEW",
  //         timeInForce: "GTC",
  //         type: "STOP_LOSS_LIMIT",
  //         side: "BUY",
  //         fills: [],
  //         isIsolated: false,
  //         selfTradePreventionMode: "EXPIRE_MAKER",
  //       },
  //       __v: 0,
  //       resultOrder: {
  //         symbol: "BTCUSDT",
  //         orderId: 24051375542,
  //         clientOrderId: "jV9pJMXdFdWDCmoKVPQUSb",
  //         transactTime: 1704290780890,
  //         price: "0",
  //         origQty: "0.00047",
  //         executedQty: "0.00047",
  //         cummulativeQuoteQty: "19.9186047",
  //         status: "FILLED",
  //         timeInForce: "GTC",
  //         type: "MARKET",
  //         side: "BUY",
  //         fills: [
  //           {
  //             price: "42380.01",
  //             qty: "0.00047",
  //             commission: "0.00004806",
  //             commissionAsset: "BNB",
  //             tradeId: 3349763023,
  //           },
  //         ],
  //         isIsolated: false,
  //         selfTradePreventionMode: "EXPIRE_MAKER",
  //       },
  //     },
  //   },
  //   {
  //     orderCount: 2,
  //     order: {
  //       _id: {
  //         $oid: "659569dd5183a50b490d48bf",
  //       },
  //       symbol: "BTCUSDT",
  //       orderId: 24051375545,
  //       clientOrderId: "ySDGPF0Oj3mEVnXwgTU3A8",
  //       transactTime: {
  //         $date: "2024-01-03T14:06:20.913Z",
  //       },
  //       price: "0",
  //       origQty: "0.00047",
  //       executedQty: "0.00047",
  //       status: "FILLED",
  //       timeInForce: "GTC",
  //       type: "MARKET",
  //       side: "SELL",
  //       isIsolated: false,
  //       selfTradePreventionMode: "EXPIRE_MAKER",
  //       fills: [
  //         {
  //           price: "42380",
  //           qty: "0.00047",
  //           commission: "0.00004811",
  //           commissionAsset: "BNB",
  //           tradeId: 3349763024,
  //         },
  //       ],
  //       bnbPrice: "310.57012594",
  //       cumulativeBnbCommission: "0.00004811",
  //       cumulativeUsdtCommission: "0.0149415287589734",
  //       executedQtyUsdt: "19.92",
  //       entryPrice: "42382.98",
  //       stopOrderPrice: "42594.89",
  //       takeProfitPrice: "42171.07",
  //       stopOrder: {
  //         symbol: "BTCUSDT",
  //         orderId: 24051375849,
  //         clientOrderId: "hUefLgG66V53rd1kN6z7wb",
  //         transactTime: 1704290781927,
  //         price: "46854.38",
  //         origQty: "0.00047",
  //         executedQty: "0",
  //         cummulativeQuoteQty: "0",
  //         status: "NEW",
  //         timeInForce: "GTC",
  //         type: "STOP_LOSS_LIMIT",
  //         side: "BUY",
  //         fills: [],
  //         isIsolated: false,
  //         selfTradePreventionMode: "EXPIRE_MAKER",
  //       },
  //       __v: 0,
  //     },
  //   },
  //   {
  //     orderCount: 3,
  //     order: {
  //       _id: {
  //         $oid: "659569de5183a50b490d48c1",
  //       },
  //       symbol: "BTCUSDT",
  //       orderId: 24051375672,
  //       clientOrderId: "6MuRdnO4zMOgQvSkq5VaFh",
  //       transactTime: {
  //         $date: "2024-01-03T14:06:21.413Z",
  //       },
  //       price: "0",
  //       origQty: "0.00047",
  //       executedQty: "0.00047",
  //       status: "FILLED",
  //       timeInForce: "GTC",
  //       type: "MARKET",
  //       side: "SELL",
  //       isIsolated: false,
  //       selfTradePreventionMode: "EXPIRE_MAKER",
  //       fills: [
  //         {
  //           price: "42380",
  //           qty: "0.00047",
  //           commission: "0.00004811",
  //           commissionAsset: "BNB",
  //           tradeId: 3349763027,
  //         },
  //       ],
  //       bnbPrice: "310.57012594",
  //       cumulativeBnbCommission: "0.00004811",
  //       cumulativeUsdtCommission: "0.0149415287589734",
  //       executedQtyUsdt: "19.92",
  //       entryPrice: "42382.98",
  //       stopOrderPrice: "42594.89",
  //       takeProfitPrice: "42171.07",
  //       stopOrder: {
  //         symbol: "BTCUSDT",
  //         orderId: 24051376021,
  //         clientOrderId: "CxbmslUChEorvLpIBGCt8y",
  //         transactTime: 1704290782903,
  //         price: "46854.38",
  //         origQty: "0.00047",
  //         executedQty: "0",
  //         cummulativeQuoteQty: "0",
  //         status: "NEW",
  //         timeInForce: "GTC",
  //         type: "STOP_LOSS_LIMIT",
  //         side: "BUY",
  //         fills: [],
  //         isIsolated: false,
  //         selfTradePreventionMode: "EXPIRE_MAKER",
  //       },
  //       __v: 0,
  //     },
  //   },
  // ]);
  const [orderCount, setOrderCount] = useState(1);

  useEffect(() => {
    // Push order to orderArray, if it already exist update it
    if (order.orderId) {
      orderArray.map((item, index, array) => {
        if (item.order.orderId === order.orderId) {
          array[index] = { orderCount: item.orderCount, order };
        } else {
          const newItem = { orderCount, order };
          setOrderCount(orderCount + 1);
          setOrderArray([...orderArray, newItem]);
        }
        console.log("order Array->", orderArray);
      });
    }
  }, [order]);

  return (
    <Box sx={{ width: "100%" }}>
      <h2>Bot Actions</h2>
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
              <>
                <Item key={item.order.clientOrderId}>
                  <Typography variant="caption" gutterBottom>
                    <strong>Order Number: {item.orderCount}</strong> <br />
                    Pair : {item.order.symbol} <br />
                    Order Status : {item.order.status} <br />
                    Stop Order Status : {item.order.stopOrder.status} <br />
                    Size : {item.order.executedQty} <br />
                    Size Usdt : ${item.order.executedQtyUsdt} <br />
                    Entry Price : {item.order.entryPrice} <br />
                    Stop Price : {item.order.stopOrderPrice} <br />
                    Take Profit Price : {item.order.takeProfitPrice} <br />
                    Profit and Loss : {item.order.profitAndLoss} <br />
                  </Typography>
                </Item>
              </>
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
