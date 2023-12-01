import { useEffect, useState, useContext } from "react";

import Header from "./Header";
import Footer from "./Footer";
import { BotContext } from "../BotContext";

const serverUrl = import.meta.env.VITE_serverUrl;
console.log(serverUrl);

const Home = () => {
  const { userMarginData, setMarginUserData } = useContext(BotContext);

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

  return (
    <div className="home-container">
      <Header />
      <Footer />
    </div>
  );
};

export default Home;
