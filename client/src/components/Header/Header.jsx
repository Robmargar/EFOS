import React from "react";
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <span className="header__icon">🔍</span>
          <h1 className="header__title">Consulta de RFCs</h1>
        </div>
        <p className="header__subtitle">
          Artículo 69-B del Código Fiscal de la Federación
        </p>
      </div>
    </header>
  );
};
