import { useState } from "react";
import { Stats } from "./components/Stats/Stats";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { RFCSearch } from "./components/RFCSearch/RFCSearch";
import "./App.css";

function App() {
  return (
    <div className="principalContainer">
      <Header />
      <div className="container">
        <Stats />
        <RFCSearch />
      </div>
      <Footer />
    </div>
  );
}

export default App;
