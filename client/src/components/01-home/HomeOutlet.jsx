import AssetsTable from "../02-margin/AssetsTable";
import PieChartAssets from "../07-pie-chart/PieChart";

import { Box, Divider } from "@mui/material";

const HomeOutlet = () => {
  return (
    <>
      <AssetsTable />

      <Box my={5}>
        <Divider />
      </Box>

      <PieChartAssets />
    </>
  );
};

export default HomeOutlet;
