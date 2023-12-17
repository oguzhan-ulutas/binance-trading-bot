import { useEffect, useState, useContext } from "react";

import Footer from "./Footer";
import { BotContext } from "../BotContext";
import Body from "./Body";
import "./Home.css";

const Home = () => {
  const {
    serverUrl,
    userMarginData,
    setMarginUserData,
    assetsSymbolArray,
    setCurrentAssetsPrices,
  } = useContext(BotContext);

  useEffect(() => {
    const url = `${serverUrl}/margin/userData`;
    fetch(url, { mode: "cors" })
      .then((res) => {
        if (res.status >= 400) {
          throw new Error("server error");
        }
        return res.json();
      })
      .then((res) => {
        setMarginUserData(res);
      })
      .catch((err) => {
        console.log("User data fetch error in Home component: ", err);
      });
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
      .then((res) => {
        setCurrentAssetsPrices(res.prices);
      })
      .catch((err) => {
        console.log("Fetch error in Home", err);
      });
  }, [userMarginData]);

  console.log(userMarginData);

  return (
    <div className="home-container">
      <Body />
      <Footer />
    </div>
  );
};

export default Home;
