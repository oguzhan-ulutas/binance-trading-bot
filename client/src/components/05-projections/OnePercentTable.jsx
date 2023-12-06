import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { format, addDays, addWeeks, addYears } from "date-fns";

const columns = [
  { id: "id", label: "id", minWidth: 50 },
  { id: "date", label: "Date", minWidth: 80 },
  { id: "calculatedBalance", label: "Balance", minWidth: 100 },
];

const OnePercentTable = ({ marginBalance, profit, period, interval }) => {
  function createData(balance, profit, period, interval) {
    const rows = [];
    const today = new Date();
    let calculatedBalance = balance;

    for (let i = 1; i <= interval; i++) {
      const date = new Date(today);
      if (period === "Day") {
        date.setDate(today.getDate() + i);
      } else if (period === "Week") {
        date.setDate(today.getDate() + i * 7);
      } else {
        date.setFullYear(today.getFullYear() + i);
      }

      calculatedBalance =
        calculatedBalance + (calculatedBalance * profit) / 100;
      const row = { date, calculatedBalance: Number(calculatedBalance), id: i };
      rows.push(row);
    }
    return rows;
  }
  const rows = createData(marginBalance, profit, period, interval);
  rows.map((row) => {
    console.log(row[columns[0].id]);
  });
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
                    if (column.id !== "date" && value >= 50000) {
                      classTd = "yellow";
                    }
                    if (column.id !== "date" && value >= 100000) {
                      classTd = "orange";
                    }

                    if (column.id !== "date" && value >= 1000000) {
                      classTd = "purple";
                    }
                    if (column.id !== "date" && value >= 10000000) {
                      classTd = "red";
                    }
                    if (column.id !== "date" && value >= 100000000) {
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
                          : column.id === "date"
                          ? format(value, "yyyy-MM-dd")
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

export default OnePercentTable;
