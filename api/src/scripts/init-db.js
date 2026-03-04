// src/scripts/init-db.js
require("dotenv").config();
const { sequelize } = require("../config/connection");
const Contribuyente = require("../models/contribuyente");

const initDatabase = async () => {
  try {
    console.log("🔌 Conectando a PostgreSQL...");
    await sequelize.authenticate();
    console.log("✅ Conexión exitosa");

    console.log("📦 Sincronizando modelos...");
    await sequelize.sync({
      force: false, // false = no borrar tablas existentes
      alter: true, // true = ajustar columnas si hay cambios
    });

    console.log("✅ Tablas creadas correctamente");
    console.log('📋 Tabla "contribuyentes" lista para usar');

    process.exit(0);
  } catch (error) {
    console.error("❌ Error inicializando DB:", error.message);
    process.exit(1);
  }
};

initDatabase();
