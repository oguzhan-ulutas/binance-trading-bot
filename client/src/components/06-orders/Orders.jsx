import { useState } from "react";

import OrderFetch from "./OrderFetch";
import OrderTable from "./OrderTable";

const Trades = () => {
  const [rows, setRows] = useState([]);
  return (
    <>
      <OrderFetch rows={rows} setRows={setRows} />
      <OrderTable rows={rows} setRows={setRows} />
    </>
  );
};

export default Trades;
