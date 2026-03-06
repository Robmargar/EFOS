import React from "react";
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <img className="header_image" src="/MIYANA-DARK.svg" alt="" />
      <div className="header__container">
        <div className="header__logo">
          <h1 className="header__title">Consulta de EFOS</h1>
        </div>
        <p className="header__subtitle">
          Artículo 69-B del Código Fiscal de la Federación
        </p>
      </div>
    </header>
  );
};
