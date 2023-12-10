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
                    <TableCell>Pair</TableCell>
                    <TableCell align="right">Order ID</TableCell>
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
                    <TableRow key={historyRow.orderId}>
                      <TableCell component="th" scope="row">
                        {historyRow.symbol}
                      </TableCell>
                      <TableCell>{historyRow.orderId}</TableCell>
                      <TableCell align="right">
                        {`${historyRow.time.slice(
                          0,
                          10
                        )} / ${historyRow.time.slice(11, 19)}`}
                      </TableCell>
                      <TableCell align="right">{historyRow.side}</TableCell>
                      <TableCell align="right">{historyRow.price}</TableCell>
                      <TableCell align="right">{historyRow.origQty}</TableCell>
                      <TableCell align="right">
                        {historyRow.executedQty}
                      </TableCell>
                      <TableCell align="right">{historyRow.status}</TableCell>
                      <TableCell align="right">{historyRow.type}</TableCell>
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

const OrderTable = () => {
  const { userAssets, serverUrl } = React.useContext(BotContext);
  const [rows, setRows] = React.useState([]);

  async function fetchAssetOrders(pair) {
    const url = `${serverUrl}/margin/orderbyname`;

    const result = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pair }),
    });

    if (result.status >= 400) {
      throw new Error("server error");
    }
    const data = await result.json();

    return data;
  }

  React.useEffect(() => {
    const fetchDataForAssets = async () => {
      const promises = userAssets.map(async (asset) => {
        const history = await fetchAssetOrders(asset.asset);

        return createData(
          asset.asset,
          asset.borrowed,
          asset.free,
          asset.interest,
          asset.locked,
          asset.netAsset,
          history.orders
        );
      });

      try {
        const rowsArray = await Promise.all(promises);
        setRows(rowsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataForAssets();
  }, [userAssets]);

  rows.sort((a, b) => a.name.localeCompare(b.name));
  console.log(rows);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Asset</TableCell>
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
