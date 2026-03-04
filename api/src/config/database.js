const { Sequelize } = require("sequelize");
require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const config = require("./config.json")[env];

// Usar variables de entorno si están definidas
const sequelize = new Sequelize(
  process.env.DB_NAME || config.database,
  process.env.DB_USER || config.username,
  process.env.DB_PASSWORD || config.password,
  {
    host: process.env.DB_HOST || config.host,
    port: process.env.DB_PORT || config.port,
    dialect: "postgres",
    logging: config.logging,
    pool: config.pool,
    dialectOptions: config.dialectOptions,
    timezone: "-06:00", // Ajusta a tu zona horaria
  },
);

// Test de conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida");
  } catch (error) {
    console.error("❌ Error de conexión a PostgreSQL:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
