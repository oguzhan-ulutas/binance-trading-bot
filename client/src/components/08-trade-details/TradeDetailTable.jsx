import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  symbol,
  qty,
  price,
  quoteQty,
  time,
  commissionAsset,
  commission,
  commissionUsdt,
  id
) {
  return {
    symbol,
    qty,
    price,
    quoteQty,
    time,
    commissionAsset,
    commission,
    commissionUsdt,
    id,
  };
}

const rows = [];

export default function TradeDetailTable({ trades }) {
  !rows.length
    ? trades.map((trade) => {
        const row = createData(
          trade.symbol,
          trade.qty,
          trade.price,
          trade.quoteQty,
          `${trade.time.slice(0, 10)} / ${trade.time.slice(11, 19)}`,
          trade.commissionAsset,
          trade.commission,
          trade.commissionUsdt,
          trade._id
        );
        rows.push(row);
      })
    : null;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total Usdt Value</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Commission Asset</TableCell>
            <TableCell align="right">Commission</TableCell>
            <TableCell align="right">Commission Usdt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.symbol}
              </TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.quoteQty}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.commissionAsset}</TableCell>
              <TableCell align="right">{row.commission}</TableCell>
              <TableCell align="right">
                {parseFloat(row.commissionUsdt).toFixed(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
