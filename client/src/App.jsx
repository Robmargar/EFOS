import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Stats } from "./components/Stats/Stats";
import { RFCSearch } from "./components/RFCSearch/RFCSearch";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Stats />
        <RFCSearch />
      </div>
      <footer className="app__footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} Consulta de RFCs - Artículo 69-B CFF
          </p>
          <p className="app__footer-disclaimer">
            Datos de carácter público obtenidos del SAT
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
