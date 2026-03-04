const { ValidationError, DatabaseError, ConnectionError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Errores de validación de Sequelize
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }
  
  // Errores de base de datos
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      success: false,
      error: 'Error en la base de datos',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }
  
  // Errores de conexión
  if (err instanceof ConnectionError) {
    return res.status(503).json({
      success: false,
      error: 'Servicio temporalmente no disponible',
      message: 'No se pudo conectar a la base de datos'
    });
  }
  
  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;