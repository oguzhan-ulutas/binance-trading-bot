import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";

import { StrategyOneContext } from "./StrategyOneContext";

function createData(
  orderId,
  symbol,
  side,
  status,
  stopOrderStatus,
  entryPrice,
  executedQty,
  executedQtyUsdt,
  cumulativeUsdtCommission,
  stopOrderPrice,
  takeProfitPrice
) {
  return {
    orderId,
    symbol,
    side,
    status,
    stopOrderStatus,
    entryPrice,
    executedQty,
    executedQtyUsdt,
    cumulativeUsdtCommission,
    stopOrderPrice,
    takeProfitPrice,
  };
}

const columns = [
  {
    width: 120,
    label: "Order Id",
    dataKey: "orderId",
  },
  {
    width: 120,
    label: "Pair",
    dataKey: "symbol",
  },
  {
    width: 120,
    label: "Side",
    dataKey: "side",
  },
  {
    width: 120,
    label: "Status",
    dataKey: "status",
  },
  {
    width: 120,
    label: "Stop Order Status",
    dataKey: "stopOrderStatus",
  },
  {
    width: 120,
    label: "Entry Price",
    dataKey: "entryPrice",
    numeric: true,
  },
  {
    width: 120,
    label: "Executed Qty",
    dataKey: "executedQty",
    numeric: true,
  },
  {
    width: 120,
    label: "Executed Qty Usdt",
    dataKey: "executedQtyUsdt",
    numeric: true,
  },
  {
    width: 120,
    label: "Commission (usdt)",
    dataKey: "cumulativeUsdtCommission",
    numeric: true,
  },
  {
    width: 120,
    label: "Stop Price",
    dataKey: "stopOrderPrice",
    numeric: true,
  },
  {
    width: 120,
    label: "Take Profit Price",
    dataKey: "takeProfitPrice",
    numeric: true,
  },
];

const rows = [];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function BotInfoTable() {
  const { order } = React.useContext(StrategyOneContext);
  // Crete new row
  const [id, setId] = React.useState(1);
  React.useState(() => {
    const newRow = createData(
      id,
      order.symbol,
      order.side,
      order.status,
      order.stopOrder.status,
      order.entryPrice,
      order.executedQty,
      order.executedQtyUsdt,
      order.cumulativeUsdtCommission,
      order.stopOrderPrice,
      order.takeProfitPrice
    );
    setId(id + 1);
    rows.push(newRow);
  }, [order]);
  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
