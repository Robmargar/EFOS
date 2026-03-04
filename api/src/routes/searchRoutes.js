// src/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const validateRFCMiddleware = require('../middleware/validateRFC');
const {
  searchByRFC,
  searchSingleRFC,
  searchBySituacion,
  getStats
} = require('../controllers/searchController');

// Rate limiting básico (opcional, requiere express-rate-limit)
// const rateLimit = require('express-rate-limit');
// const searchLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 100, // límite por IP
//   message: { success: false, error: 'Demasiadas solicitudes, intenta más tarde' }
// });

/**
 * @route POST /api/search/search
 * @desc Buscar múltiples RFCs
 * @access Public
 * @body { rfcs: ["AAA010101AAA", "BBB020202BBB"] }
 */
router.post('/search', validateRFCMiddleware, searchByRFC);

/**
 * @route GET /api/search/:rfc
 * @desc Buscar un RFC individual
 * @access Public
 */
router.get('/:rfc', searchSingleRFC);

/**
 * @route GET /api/search/situacion/:tipo
 * @desc Buscar por tipo de situación
 * @access Public
 */
router.get('/situacion/:tipo', searchBySituacion);

/**
 * @route GET /api/search/stats
 * @desc Obtener estadísticas generales
 * @access Public
 */
router.get('/estatus/stats', getStats);

module.exports = router;