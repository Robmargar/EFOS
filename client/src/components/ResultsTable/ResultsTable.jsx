import React, { useState } from "react";
import "./ResultsTable.css";

export const ResultsTable = ({ results, notFound, loading, duplicated }) => {
  const [menus, setMenus] = useState({
    menu1: false,
    menu2: false,
    duplicated: false,
  });
  const getSituacionClass = (situacion) => {
    if (!situacion) return "situacion--unknown";
    const lower = situacion.toLowerCase();
    if (lower.includes("definitivo")) return "situacion--definitivo";
    if (lower.includes("presunto")) return "situacion--presunto";
    if (lower.includes("desvirtuado")) return "situacion--desvirtuado";
    if (lower.includes("sentencia")) return "situacion--sentencia";
    return "situacion--unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="results-table results-table--loading">
        <div className="results-table__loader">
          <div className="results-table__spinner"></div>
          <p>Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  const toggle = (name) => {
    setMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div>
      <section className="results-table">
        <div className="results-table__header">
          <img className="icon" src="/warning-icon.svg" alt="warning-icon" />
          <h2 className="results-table__title">
            {results.length} RFC encontrados
          </h2>
          <button className="results-button" onClick={() => toggle("menu1")}>
            {!menus.menu1 ? (
              <img
                className="icon"
                src="/arrow-down-icon.svg"
                alt="arrow-down-icon"
              />
            ) : (
              <img
                className="icon"
                src="/arrow-up-icon.svg"
                alt="arrow-up-icon"
              />
            )}
          </button>
          <button className="results-button">
            <img className="icon-download" src="/download-icon.svg" alt="download-icon" />
          </button>
        </div>
        {menus.menu1 ? (
          <div className="results-table__container">
            <table className="results-table__table">
              <thead>
                <tr>
                  <th className="results-table__th">RFC</th>
                  <th className="results-table__th">
                    Nombre del Contribuyente
                  </th>
                  <th className="results-table__th">Situación</th>
                  <th className="results-table__th">Última Actualización</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={item.rfc || index} className="results-table__row">
                    <td className="results-table__td results-table__td--rfc">
                      <code>{item.rfc}</code>
                    </td>
                    <td className="results-table__td">
                      {item.nombre_contribuyente}
                    </td>
                    <td className="results-table__td">
                      <span
                        className={`results-table__badge ${getSituacionClass(item.situacion_contribuyente)}`}
                      >
                        {item.situacion_contribuyente || "N/A"}
                      </span>
                    </td>
                    <td className="results-table__td">
                      {formatDate(item.fecha_actualizacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <></>
        )}
      </section>
      <section className="results-table">
        {notFound && notFound.length > 0 && (
          <div className="results-table__not-found">
            <div className="results-table__not-found-title">
              <img className="icon" src="/check-icon.svg" alt="check-icon" />
              <h3 className="results-table__not-found">
                {notFound.length} RFC no encontrados.
              </h3>
              <button
                className="results-button"
                onClick={() => toggle("menu2")}
              >
                {!menus.menu2 ? (
                  <img
                    className="icon"
                    src="/arrow-down-icon.svg"
                    alt="arrow-down-icon"
                  />
                ) : (
                  <img
                    className="icon"
                    src="/arrow-up-icon.svg"
                    alt="arrow-up-icon"
                  />
                )}
              </button>
            </div>
            {menus.menu2 ? (
              <div className="results-table__not-found-list">
                {notFound.map((rfc, index) => (
                  <span key={index} className="results-table__not-found-item">
                    <code>{rfc}</code>
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </section>
      <section className="results-table">
        {duplicated && duplicated.length > 0 && (
          <div className="results-table__not-found">
            <div className="results-table__not-found-title">
              <img
                className="icon"
                src="/warning-duplicated-icon.svg"
                alt="check-icon"
              />
              <h3 className="results-table__not-found">
                {duplicated.length} RFC duplicados.
              </h3>
              <button
                className="results-button"
                onClick={() => toggle("duplicated")}
              >
                {!menus.duplicated ? (
                  <img
                    className="icon"
                    src="/arrow-down-icon.svg"
                    alt="arrow-down-icon"
                  />
                ) : (
                  <img
                    className="icon"
                    src="/arrow-up-icon.svg"
                    alt="arrow-up-icon"
                  />
                )}
              </button>
            </div>
            {menus.duplicated ? (
              <div className="results-table__not-found-list">
                {duplicated.map((rfc, index) => (
                  <span key={index} className="results-table__not-found-item">
                    <code>{rfc}</code>
                  </span>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
