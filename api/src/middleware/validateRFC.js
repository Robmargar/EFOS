// src/middleware/validateRFC.js
const { validateRFCs } = require('../utils/rfcValidator');

const validateRFCMiddleware = (req, res, next) => {
  const { rfcs } = req.body;

  const validacion = validateRFCs(rfcs);

  if (!validacion.valid) {
    return res.status(400).json({
      success: false,
      error: validacion.error,
      detalles: validacion.errores,
      metadata: {
        total: validacion.total,
        validos: validacion.validos,
        invalidos: validacion.invalidos
      }
    });
  }

  // Agregar RFCs validados al request para el controller
  req.validatedRFCs = validacion.rfcs;
  req.validationMetadata = {
    total: validacion.total,
    validos: validacion.validos
  };

  next();
};

module.exports = validateRFCMiddleware;