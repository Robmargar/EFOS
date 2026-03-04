// models/index.js
const Contribuyente = require("./contribuyente");

// Aquí puedes definir relaciones si tienes más modelos
// Contribuyente.associate({ /* otros modelos */ });

module.exports = {
  Contribuyente,
  sequelize: Contribuyente.sequelize,
  Sequelize: Contribuyente.Sequelize,
};
