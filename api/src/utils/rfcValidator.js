// src/utils/rfcValidator.js

/**
 * Valida el formato de un RFC mexicano
 * Personas Morales: 12 caracteres (AAA010101AAA)
 * Personas Físicas: 13 caracteres (AAAA010101AAA)
 */
const validateRFC = (rfc) => {
  if (!rfc || typeof rfc !== 'string') {
    return { valid: false, error: 'RFC es requerido' };
  }

  const rfcLimpio = rfc.trim().toUpperCase();

  // Patrón general para RFC mexicanos
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/;

  if (!rfcPattern.test(rfcLimpio)) {
    return { 
      valid: false, 
      error: 'Formato de RFC inválido. Ejemplo: AAA010101AAA (12-13 caracteres)' 
    };
  }

  // Validar longitud (12 para moral, 13 para física)
  if (rfcLimpio.length !== 12 && rfcLimpio.length !== 13) {
    return { 
      valid: false, 
      error: 'RFC debe tener 12 (moral) o 13 (física) caracteres' 
    };
  }

  return { valid: true, rfc: rfcLimpio };
};

/**
 * Valida un array de RFCs
 */
const validateRFCs = (rfcs) => {
  if (!Array.isArray(rfcs)) {
    return { valid: false, error: 'Debe proporcionar un array de RFCs' };
  }

  if (rfcs.length === 0) {
    return { valid: false, error: 'El array de RFCs no puede estar vacío' };
  }

  if (rfcs.length > 100) {
    return { valid: false, error: 'Máximo 100 RFCs por consulta' };
  }

  const resultados = [];
  const errores = [];

  for (const rfc of rfcs) {
    const validacion = validateRFC(rfc);
    if (validacion.valid) {
      resultados.push(validacion.rfc);
    } else {
      errores.push({ rfc, error: validacion.error });
    }
  }

  return {
    valid: errores.length === 0,
    rfcs: resultados,
    errores,
    total: rfcs.length,
    validos: resultados.length,
    invalidos: errores.length
  };
};

module.exports = { validateRFC, validateRFCs };