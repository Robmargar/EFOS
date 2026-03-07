// src/components/RFCSearch/RFCSearch.jsx
import React, { useState } from "react";
import axios from "axios";
import { SearchInput } from "../SearchInput/SearchInput";
import { ResultsTable } from "../ResultsTable/ResultsTable";
import "./RFCSearch.css";

// ✅ CORRECCIÓN: Usar import.meta.env para Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const RFCSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [notFound, setNotFound] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [duplicated, setDuplicated] = useState([]);

  const procesarDuplicados = (array) => {
    const duplicadosRaw = array.filter((item, index) => {
      return array.indexOf(item) !== index;
    });
    const listaDuplicados = [...new Set(duplicadosRaw)];
    const arrayLimpio = [...new Set(array)];

    return {
      duplicados: listaDuplicados,
      limpio: arrayLimpio,
    };
  };

  const parseRFCs = (text) => {
    return text
      .split(/[\n,;]/)
      .map((rfc) => rfc.trim())
      .filter((rfc) => rfc.length > 0);
  };

  const handleSearch = async () => {
    const parse = parseRFCs(inputValue);
    const resp = procesarDuplicados(parse);
    const rfcs = resp.limpio;

    if (resp.duplicados.length > 0) {
      setDuplicated(resp.duplicados);
    }

    if (rfcs.length === 0) {
      setError("⚠️ Ingresa al menos un RFC");
      return;
    }

    if (rfcs.length > 100) {
      setError("⚠️ Máximo 100 RFCs por consulta");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // console.log("🔍 Consultando API:", `${API_URL}/search/search`);
      // console.log("📦 RFCs a buscar:", rfcs);

      const response = await axios.post(`${API_URL}/search/search`, {
        rfcs,
      });

      // console.log("✅ Respuesta:", response.data);

      setResults(response.data.data?.resultados || []);
      setNotFound(response.data.data?.noEncontrados || []);

      if (
        response.data.data?.noEncontrados?.length > 0 &&
        response.data.data?.resultados.length === 0
      ) {
        setError(`✅ Felicidades ninguno de los RFC(s) fue encontrado`);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "❌ Error al consultar. Intenta nuevamente.",
      );
      setResults([]);
      setNotFound([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setResults([]);
    setNotFound([]);
    setDuplicated([]);
    setError(null);
    setSearched(false);
  };

  return (
    <div className="rfc-search">
      <SearchInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {error && (
        <div className="rfc-search__alert rfc-search__alert--success">
          {error}
        </div>
      )}

      {searched && results.length === 0 && notFound.length === 0 && !error && (
        <div className="rfc-search__alert rfc-search__alert--info">
          ℹ️ No se encontraron resultados. Verifica los RFCs ingresados.
        </div>
      )}

      <ResultsTable results={results} notFound={notFound} loading={loading} duplicated={duplicated} />
    </div>
  );
};
