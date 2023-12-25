import { useEffect, useState, useContext } from "react";

import Footer from "./Footer";
import { BotContext } from "../BotContext";
import Body from "./Body";
import "./Home.css";

const Home = () => {
  const { serverUrl, userMarginData, setUserMarginData, assetsSymbolArray } =
    useContext(BotContext);

  const [render, setRender] = useState(0);

  const fetchUserData = () => {
    const url = `${serverUrl}/margin/userData`;
    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setUserMarginData(res);
        setRender(render + 1);
      })
      .catch((err) => {
        console.log("User data fetch error in Home component: ", err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Calculate user assets usdt value

  useEffect(() => {
    const url = `${serverUrl}/margin/user-assets-usdt`;

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assetsSymbolArray }),
    })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then(async (res) => {
        const { prices } = res;

        // Get copy of state
        const data = { ...userMarginData };
        await prices.map((asset) => {
          data.userAssets.map((userAsset) => {
            if (asset.symbol.startsWith(userAsset.asset)) {
              userAsset.lastPrice = asset.price;
              userAsset.lastUsdtValue =
                parseFloat(userAsset.netAsset) * parseFloat(asset.price);
            }
          });
        });

        await data.userAssets.map((asset) => {
          if (asset.asset === "USDT") {
            asset.lastPrice = 1;
            asset.lastUsdtValue = asset.netAsset;
          }
        });

        // Extract borrowed coins from netBalance
        const borrowedAssets = await userMarginData.userAssets.filter(
          (asset) => asset.borrowed !== "0"
        );

        const borrowedUsdtValue = await borrowedAssets.reduce((acc, asset) => {
          return acc + asset.lastUsdtValue;
        }, 0);
        console.log(borrowedUsdtValue);
        data.netBalance =
          parseFloat(data.netBalance) + parseFloat(borrowedUsdtValue);

        setUserMarginData(data);
      })
      .catch((err) => {
        console.log("Fetch error in Home", err);
      });
  }, [render]);

  console.log(userMarginData);

  return (
    <div className="home-container">
      <Body fetchUserData={fetchUserData} />
      <Footer />
    </div>
  );
};

export default Home;
