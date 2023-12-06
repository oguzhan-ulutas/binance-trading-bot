import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import "./LongTermTable.css";

const columns = [
  { id: "year", label: "Year", minWidth: 80 },
  { id: "balance10", label: "10%", minWidth: 100 },
  {
    id: "balance20",
    label: "20%",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "balance30",
    label: "30%",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "balance40",
    label: "40%",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "balance50",
    label: "50%",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "balance75",
    label: "75%",
    minWidth: 100,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "balance100",
    label: "100%",
    minWidth: 100,
    align: "right",
  },
];

function createData(balance) {
  const rows = [];

  let balance10 = balance;
  let balance20 = balance;
  let balance30 = balance;
  let balance40 = balance;
  let balance50 = balance;
  let balance75 = balance;
  let balance100 = balance;

  for (let year = 2023; year <= 2060; year++) {
    balance10 = balance10 + balance10 * 0.1;
    balance20 = balance20 + balance20 * 0.2;
    balance30 = balance30 + balance30 * 0.3;
    balance40 = balance40 + balance40 * 0.4;
    balance50 = balance50 + balance50 * 0.5;
    balance75 = balance75 + balance75 * 0.75;
    balance100 = balance100 + balance100;
    const row = {
      year,
      balance10,
      balance20,
      balance30,
      balance40,
      balance50,
      balance75,
      balance100,
    };
    rows.push(row);
  }
  return rows;
}

export default function LongTermTable({ marginBalance }) {
  const rows = createData(Number(marginBalance));
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
                    if (value >= 50000) {
                      classTd = "yellow";
                    }
                    if (value >= 100000) {
                      classTd = "orange";
                    }

                    if (value >= 1000000) {
                      classTd = "purple";
                    }
                    if (value >= 10000000) {
                      classTd = "red";
                    }
                    if (value >= 100000000) {
                      classTd = "brown";
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={classTd}
                      >
                        {value.toLocaleString("en-US", {
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
}
