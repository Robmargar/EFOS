// src/server.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { testConnection } = require("./src/config/connection");
const searchRoutes = require("./src/routes/searchRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5172", // Puerto por defecto de Vite
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  message: {
    success: false,
    error: "Demasiadas solicitudes, intenta más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await testConnection();
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Rutas de la API
app.use("/api/search", apiLimiter, searchRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "API de Consulta de RFCs - Artículo 69-B CFF",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      search: "POST /api/search/search",
      singleSearch: "GET /api/search/:rfc",
      bySituacion: "GET /api/search/situacion/:tipo",
      stats: "GET /api/search/stats",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado",
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error("❌ Error global:", err.message);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Error interno del servidor",
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API Endpoints disponibles:`);
      console.log(`   • GET  /health`);
      console.log(`   • POST /api/search/search`);
      console.log(`   • GET  /api/search/:rfc`);
      console.log(`   • GET  /api/search/situacion/:tipo`);
      console.log(`   • GET  /api/search/stats\n`);
    });
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error.message);
    process.exit(1);
  }
};

startServer();
