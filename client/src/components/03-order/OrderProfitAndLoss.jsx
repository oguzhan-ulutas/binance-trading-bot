import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "id", label: "id", minWidth: 80 },
  { id: "percent", label: "Percent(%)", minWidth: 100 },
  { id: "profit", label: "Profit(usdt)", minWidth: 100 },
  { id: "loss", label: "Loss(usdt)", minWidth: 100 },
];

function createData(size) {
  const rows = [];

  for (let i = 1; i <= 100; i++) {
    const profit = (size * i) / 100;
    const loss = -(size * i) / 100;
    const row = { id: i, percent: i, profit, loss };
    rows.push(row);
  }
  return rows;
}

const OrderProfitAndLoss = ({ tradeSize }) => {
  const rows = createData(tradeSize);
  console.log(rows);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    const value = row[column.id];

                    let classTd = "";
                    if (value >= 50 || value <= -50) {
                      classTd = "yellow";
                    }
                    if (value >= 100 || value <= -100) {
                      classTd = "orange";
                    }

                    if (value >= 250 || value <= -250) {
                      classTd = "purple";
                    }
                    if (value >= 500 || value <= -500) {
                      classTd = "red";
                    }
                    if (value >= 1000 || value <= -1000) {
                      classTd = "brown";
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={classTd}
                      >
                        {column.id === "id"
                          ? value
                          : column.id === "percent"
                          ? `${value}%`
                          : value.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderProfitAndLoss;
