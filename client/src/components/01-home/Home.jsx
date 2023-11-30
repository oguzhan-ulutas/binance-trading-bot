import { useEffect, useState } from "react";
import { Spot } from "@binance/connector";

import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  const [balance, setBalance] = useState(null);
  const apiKey = import.meta.env.VITE_binanceApiKey;
  const apiSecret = import.meta.env.VITE_binanceApiSecretKey;
  const client = new Spot(apiKey, apiSecret);

  useEffect(() => {
    client
      .marginAccount()
      .then((response) => client.logger.log(response.data))
      .catch((error) => client.logger.error(error));
  }, []);

  return (
    <div className="home-container">
      <Header />
      <Footer />
    </div>
  );
};

export default Home;
