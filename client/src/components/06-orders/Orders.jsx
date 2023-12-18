import { useState } from "react";

import OrderFetch from "./OrderFetch";
import OrderTable from "./OrderTable";
import TradeDetailDialog from "../08-trade-details/TradeDetailDialog";

const Trades = () => {
  const [rows, setRows] = useState([]);
  return (
    <>
      <OrderFetch rows={rows} setRows={setRows} />
      <OrderTable rows={rows} setRows={setRows} />
      <TradeDetailDialog />
    </>
  );
};

export default Trades;
