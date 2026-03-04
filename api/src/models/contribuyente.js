// src/models/contribuyente.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connection");

const Contribuyente = sequelize.define(
  "Contribuyente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rfc: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
      validate: {
        len: [12, 13],
      },
    },
    nombre_contribuyente: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    situacion_contribuyente: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "contribuyentes",
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["rfc"],
      },
    ],
  },
);

module.exports = Contribuyente;
