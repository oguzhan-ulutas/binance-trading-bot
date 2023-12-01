import { useEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  const [balance, setBalance] = useState(null);

  return (
    <div className="home-container">
      <Header />
      <Footer />
    </div>
  );
};

export default Home;
