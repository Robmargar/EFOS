// src/controllers/searchController.js
const { Op } = require("sequelize");
const Contribuyente = require("../models/contribuyente");

/**
 * Búsqueda de RFCs en la base de datos
 * POST /api/search/search
 */
const searchByRFC = async (req, res) => {
  try {
    const rfcs = req.validatedRFCs;
    const metadata = req.validationMetadata;

    console.log(`🔍 Búsqueda de ${rfcs.length} RFC(s)`);

    // Buscar en la base de datos
    const resultados = await Contribuyente.findAll({
      where: {
        rfc: {
          [Op.in]: rfcs,
        },
      },
      attributes: [
        "rfc",
        "nombre_contribuyente",
        "situacion_contribuyente",
        "fecha_actualizacion",
      ],
      order: [["rfc", "ASC"]],
    });

    // Calcular RFCs no encontrados
    const foundRFCs = new Set(resultados.map((r) => r.rfc));
    const notFound = rfcs.filter((rfc) => !foundRFCs.has(rfc));

    // Preparar respuesta
    const response = {
      success: true,
      data: {
        resultados,
        noEncontrados: notFound,
      },
      metadata: {
        fechaConsulta: new Date().toISOString(),
        totalConsultados: metadata.total,
        encontrados: resultados.length,
        noEncontrados: notFound.length,
        porcentajeEncontrados:
          ((resultados.length / metadata.total) * 100).toFixed(2) + "%",
      },
    };

    console.log(
      `✅ Búsqueda completada: ${resultados.length}/${rfcs.length} encontrados`,
    );

    res.json(response);
  } catch (error) {
    console.error("❌ Error en búsqueda:", error.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Búsqueda individual de un RFC
 * GET /api/search/:rfc
 */
const searchSingleRFC = async (req, res) => {
  try {
    const { rfc } = req.params;
    const rfcUpper = rfc.trim().toUpperCase();

    const contribuyente = await Contribuyente.findOne({
      where: { rfc: rfcUpper },
      attributes: [
        "rfc",
        "nombre_contribuyente",
        "situacion_contribuyente",
        "fecha_actualizacion",
        "fecha_creacion",
      ],
    });

    if (!contribuyente) {
      return res.status(404).json({
        success: false,
        error: "RFC no encontrado en la base de datos",
        data: { rfc: rfcUpper },
      });
    }

    res.json({
      success: true,
      data: contribuyente,
      metadata: {
        fechaConsulta: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error en búsqueda individual:", error.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

/**
 * Búsqueda por situación del contribuyente
 * GET /api/search/situacion/:tipo
 * Tipos: Presunto, Definitivo, Desvirtuado, Sentencia Favorable
 */
const searchBySituacion = async (req, res) => {
  try {
    const { tipo } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const tiposValidos = [
      "Presunto",
      "Definitivo",
      "Desvirtuado",
      "Sentencia Favorable",
    ];

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        error: `Tipo inválido. Opciones: ${tiposValidos.join(", ")}`,
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Contribuyente.findAndCountAll({
      where: {
        situacion_contribuyente: tipo,
      },
      attributes: [
        "rfc",
        "nombre_contribuyente",
        "situacion_contribuyente",
        "fecha_actualizacion",
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["rfc", "ASC"]],
    });

    res.json({
      success: true,
      data: {
        resultados: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRegistros: count,
          registrosPorPagina: parseInt(limit),
        },
      },
      metadata: {
        fechaConsulta: new Date().toISOString(),
        tipoSituacion: tipo,
      },
    });
  } catch (error) {
    console.error("❌ Error en búsqueda por situación:", error.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};

/**
 * Estadísticas generales
 * GET /api/search/stats
 */
const getStats = async (req, res) => {
  try {
    const total = await Contribuyente.count();

    const porSituacion = await Contribuyente.findAll({
      attributes: [
        "situacion_contribuyente",
        [Contribuyente.sequelize.fn("COUNT", "*"), "cantidad"],
      ],
      group: ["situacion_contribuyente"],
      raw: true,
    });

    const ultimaActualizacion = await Contribuyente.max("fecha_actualizacion");

    res.json({
      success: true,
      data: {
        totalContribuyentes: total,
        porSituacion: porSituacion.reduce((acc, item) => {
          acc[item.situacion_contribuyente || "Sin clasificación"] = parseInt(
            item.cantidad,
          );
          return acc;
        }, {}),
        ultimaActualizacion: ultimaActualizacion || null,
      },
      metadata: {
        fechaConsulta: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error en estadísticas:", error.message);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
};



module.exports = {
  searchByRFC,
  searchSingleRFC,
  searchBySituacion,
  getStats,
};
