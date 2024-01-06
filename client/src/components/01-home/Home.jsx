import { useEffect, useState, useContext } from "react";

import Footer from "./Footer";
import { BotContext } from "../BotContext";
import Body from "./Body";
import "./Home.css";

const Home = () => {
  const { serverUrl, userMarginData, setUserMarginData, errors, setErrors } =
    useContext(BotContext);

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
        console.log(res.errors);
        setUserMarginData(res.userMarginData);
        setErrors([...errors, ...res.errors]);
      })
      .catch((err) => {
        console.log("User data fetch error in Home component: ", err);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  console.log(userMarginData);

  return (
    <div className="home-container">
      <Body fetchUserData={fetchUserData} />
      <Footer />
    </div>
  );
};

export default Home;
