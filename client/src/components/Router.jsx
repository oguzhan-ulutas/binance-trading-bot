import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./01-home/Home";
import ErrorPage from "./ErrorPage";
import AssetsTable from "./02-margin/AssetsTable";
import Order from "./03-order/Order";
import BalanceHistoryGraph from "./04-balance-history/BalanceHistoryChart";
import Projections from "./05-projections/Projections";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <AssetsTable /> },
        { path: "order", element: <Order /> },
        { path: "balance-history", element: <BalanceHistoryGraph /> },
        { path: "projections", element: <Projections /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
