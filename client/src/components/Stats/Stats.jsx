// src/components/Stats/Stats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Stats.css";

export const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de la API para Vite
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  console.log("🔍 API_URL:", API_URL); // Debug

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("📡 Solicitando stats a:", `${API_URL}/search/estatus/stats`);
        const response = await axios.get(`${API_URL}/search/estatus/stats`, {
          timeout: 10000, // 10 segundos timeout
        });
        console.log("✅ Respuesta recibida:", response.data);
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching stats:", err.message);
        console.error("❌ Error completo:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="stats stats--loading">
        <p>⏳ Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats stats--error">
        <p>⚠️ Error: {error}</p>
        <p className="stats--hint">
          💡 Verifica que el backend esté corriendo en http://localhost:3001
        </p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return <div className="stats">{/* ... resto del componente ... */}</div>;
};
