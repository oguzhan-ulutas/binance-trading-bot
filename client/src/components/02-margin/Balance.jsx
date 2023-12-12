import { useContext } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { BotContext } from "../BotContext";
import "./Balance.css";

const Balance = () => {
  const { userMarginData } = useContext(BotContext);

  // Display target
  const calculateTarget = () => {
    let capital = 10000;
    const year = new Date().getFullYear();
    for (let i = 2022; i <= year; i++) {
      capital = capital + capital * 0.5;
    }

    return `For year ${year} your target is ${capital} usd.`;
  };

  // Display borrowed assets
  const borrowed = userMarginData.borrowEnabled
    ? userMarginData.userAssets.filter((asset) => asset.borrowed !== "0")
    : [];

  return (
    <div className="balance-margin">
      <Typography variant="h4" gutterBottom>
        MARGIN
        <br /> {calculateTarget()}
        <br /> Margin Level: {parseFloat(userMarginData.marginLevel).toFixed(2)}
      </Typography>

      {userMarginData.totalCollateralValueInUSDT ? (
        <Box className="header-info">
          <Box className="header-balance">
            <Typography variant="h6" gutterBottom>
              Tolal Balance: <br />{" "}
              {parseFloat(userMarginData.netBalance).toFixed(2)} USDT, <br />
              {userMarginData.totalNetAssetOfBtc} BTC <br />
            </Typography>
          </Box>

          <Box className="header-dept">
            <Typography variant="h6" gutterBottom>
              Tolal Dept: <br />{" "}
              {parseFloat(
                userMarginData.totalCollateralValueInUSDT -
                  userMarginData.netBalance
              ).toFixed(2)}{" "}
              USDT, <br />
              {userMarginData.totalLiabilityOfBtc} BTC <br />
            </Typography>
          </Box>

          <Box className="header-borrowed">
            <Typography variant="h6" gutterBottom>
              Borrowed Assets: <br />{" "}
              {borrowed.length > 0
                ? borrowed.map((asset) => {
                    return `${parseFloat(asset.borrowed).toFixed(2)} ${
                      asset.asset
                    }`;
                  })
                : "No borrowed asset"}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};

export default Balance;
