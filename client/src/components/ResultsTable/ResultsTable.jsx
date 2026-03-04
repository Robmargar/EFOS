import React from "react";
import "./ResultsTable.css";

export const ResultsTable = ({ results, notFound, loading }) => {
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

  return (
    <div className="results-table">
      <div className="results-table__header">
        <h2 className="results-table__title">
          📋 Resultados ({results.length} encontrados)
        </h2>
      </div>

      <div className="results-table__container">
        <table className="results-table__table">
          <thead>
            <tr>
              <th className="results-table__th">RFC</th>
              <th className="results-table__th">Nombre del Contribuyente</th>
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

      {notFound && notFound.length > 0 && (
        <div className="results-table__not-found">
          <h3 className="results-table__not-found-title">
            ⚠️ RFCs no encontrados ({notFound.length})
          </h3>
          <div className="results-table__not-found-list">
            {notFound.map((rfc, index) => (
              <span key={index} className="results-table__not-found-item">
                <code>{rfc}</code>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
