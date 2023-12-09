import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { BotContext } from "../BotContext";

function createData(name, borrowed, free, interest, locked, netAsset, history) {
  return {
    name,
    borrowed,
    free,
    interest,
    locked,
    netAsset,
    history,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.borrowed}</TableCell>
        <TableCell align="right">{row.free}</TableCell>
        <TableCell align="right">{row.interest}</TableCell>
        <TableCell align="right">{row.locked}</TableCell>
        <TableCell align="right">{row.netAsset}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Side</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Executed Qty</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
//   createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
//   createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
//   createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
// ];
const OrderTable = () => {
  const { userAssets, serverUrl } = React.useContext(BotContext);

  console.log(userAssets);

  const rows = [];
  let history = [];
  userAssets.map((asset) => {
    fetchAssetOrders(asset.asset);

    const row = createData(
      asset.asset,
      asset.borrowed,
      asset.free,
      asset.interest,
      asset.locked,
      asset.netAsset,
      history
    );
    rows.push(row);
  }),
    rows.sort((a, b) => a.name.localeCompare(b.name));
  console.log(rows);

  const fetchAssetOrders = (pair) => {
    const url = `${serverUrl}/orderbyname`;

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair }),
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        history = res;
      })
      .catch((err) => {
        console.log("Trade fetch error: ", err);
      });
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Pair</TableCell>
            <TableCell align="right">Borrowed</TableCell>
            <TableCell align="right">Free</TableCell>
            <TableCell align="right">Interest</TableCell>
            <TableCell align="right">Locked</TableCell>
            <TableCell align="right">Net Asset</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
