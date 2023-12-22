import { useContext, useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { BotContext } from "../BotContext";
import "./Balance.css";

const Balance = ({ fetchUserData }) => {
  const { userMarginData, serverUrl } = useContext(BotContext);
  const [maxBorrowableUsdt, setMaxBorrowableUsdt] = useState({});

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

  const FetchMaxBorrowAble = () => {
    const url = `${serverUrl}/margin/max-borrowable-usdt`;

    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setMaxBorrowableUsdt(res);
      })
      .catch((err) => {
        console.log("Fetch error in balance, max borrowable", err);
      });
  };

  // Get max borrowable usdt
  useEffect(() => {
    FetchMaxBorrowAble();
  }, []);

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
            <Button variant="outlined" onClick={fetchUserData}>
              Refresh
            </Button>
          </Box>

          <Box className="header-dept">
            <Typography variant="h7" gutterBottom>
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
            <Typography variant="h7" gutterBottom>
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

          <Box className="header-borrowed">
            <Typography variant="h7" gutterBottom>
              Max Borrowable Usdt: <br /> Amount:{" "}
              {parseFloat(maxBorrowableUsdt.amount).toFixed(2)}
              <br /> Limit:{" "}
              {parseFloat(maxBorrowableUsdt.borrowLimit).toFixed(2)}
            </Typography>
            <Button variant="outlined" onClick={FetchMaxBorrowAble}>
              Refresh
            </Button>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};

export default Balance;
