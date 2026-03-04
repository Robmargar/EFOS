// api/src/scripts/migrate-prod.js
require("dotenv").config();
const { sequelize } = require("../config/connection");
const Contribuyente = require("../models/contribuyente");

const migrateProd = async () => {
  try {
    console.log("🔌 Conectando a PostgreSQL en producción...");
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa");

    console.log("📦 Sincronizando modelos...");
    await sequelize.sync({
      force: false, // ⚠️ NUNCA uses true en producción
      alter: true,
    });

    console.log("✅ Migración completada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en migración:", error.message);
    process.exit(1);
  }
};

migrateProd();
