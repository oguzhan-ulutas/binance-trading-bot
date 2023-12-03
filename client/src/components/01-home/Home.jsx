import { useEffect, useState, useContext } from "react";

import Footer from "./Footer";
import { BotContext } from "../BotContext";
import Body from "../02-body/Body";
import "./Home.css";

const Home = () => {
  const { serverUrl, userMarginData, setMarginUserData } =
    useContext(BotContext);

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
  console.log(userMarginData);
  return (
    <div className="home-container">
      <Body />
      <Footer />
    </div>
  );
};

export default Home;
