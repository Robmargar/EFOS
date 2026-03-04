// src/scripts/seed-csv.js
require("dotenv").config();
const axios = require("axios");
const { sequelize } = require("../config/connection");
const Contribuyente = require("../models/contribuyente");

const CSV_URL =
  "https://wu1agsprosta001.blob.core.windows.net/agsc-publicaciones/Datos_abiertos/Documents_AGAFF/Listado_completo_69-B.csv";

const processCSV = async () => {
  try {
    console.log("📥 Descargando CSV...");
    const response = await axios.get(CSV_URL, {
      responseType: "text",
      timeout: 120000,
    });

    console.log(
      `✅ CSV descargado: ${(response.data.length / 1024 / 1024).toFixed(2)} MB`,
    );

    // Parsear líneas
    const lineas = response.data.split(/\r?\n/);

    // Encontrar encabezados
    let indiceEncabezado = -1;
    for (let i = 0; i < Math.min(lineas.length, 10); i++) {
      if (lineas[i].includes("No,RFC,Nombre del Contribuyente")) {
        indiceEncabezado = i;
        break;
      }
    }

    if (indiceEncabezado === -1) {
      throw new Error("No se encontraron los encabezados del SAT");
    }

    console.log(
      `📊 Procesando ${lineas.length - indiceEncabezado - 1} líneas...`,
    );

    // Extraer registros válidos
    const registros = [];
    let erroresParsing = 0;

    for (let i = indiceEncabezado + 1; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (!linea) continue;

      try {
        const columnas = parseCSVLine(linea);

        if (columnas.length < 4) {
          erroresParsing++;
          continue;
        }

        const rfc = columnas[1]?.replace(/"/g, "").trim().toUpperCase();
        const nombre = columnas[2]?.replace(/"/g, "").trim();
        const situacion = columnas[3]?.replace(/"/g, "").trim();

        if (
          rfc &&
          nombre &&
          rfc.length >= 12 &&
          rfc.length <= 13 &&
          /^[A-Z0-9]+$/.test(rfc)
        ) {
          registros.push({
            rfc,
            nombre_contribuyente: nombre,
            situacion_contribuyente: situacion || null,
            fecha_actualizacion: new Date(),
          });
        }
      } catch (err) {
        erroresParsing++;
      }

      if ((i - indiceEncabezado) % 2000 === 0 && i > indiceEncabezado) {
        console.log(`⏳ Procesadas ${i - indiceEncabezado} líneas...`);
      }
    }

    console.log(`\n📈 Resumen parsing:`);
    console.log(`   • Registros válidos: ${registros.length}`);
    console.log(`   • Errores/Saltados: ${erroresParsing}`);

    if (registros.length === 0) {
      console.warn("⚠️ No hay registros para insertar");
      return { total: 0, insertados: 0 };
    }

    // Insertar en PostgreSQL SIN transacción (cada insert hace auto-commit)
    console.log("🔄 Insertando en PostgreSQL...");
    console.log("💡 Nota: Desactivando logging SQL para mejor rendimiento\n");

    // Desactivar logging temporalmente
    const loggingOriginal = sequelize.options.logging;
    sequelize.options.logging = false;

    let insertados = 0;
    let actualizados = 0;
    let errores = 0;
    const batchSize = 100; // Batch más pequeño para mejor control

    for (let i = 0; i < registros.length; i += batchSize) {
      const batch = registros.slice(i, i + batchSize);

      // Process batch WITHOUT transaction wrapper
      for (const item of batch) {
        try {
          const [contribuyente, created] = await Contribuyente.findOrCreate({
            where: { rfc: item.rfc },
            defaults: {
              nombre_contribuyente: item.nombre_contribuyente,
              situacion_contribuyente: item.situacion_contribuyente,
              fecha_actualizacion: item.fecha_actualizacion,
            },
            // SIN transaction - cada uno hace auto-commit
          });

          if (created) {
            insertados++;
          } else {
            await contribuyente.update({
              nombre_contribuyente: item.nombre_contribuyente,
              situacion_contribuyente: item.situacion_contribuyente,
              fecha_actualizacion: item.fecha_actualizacion,
            });
            actualizados++;
          }
        } catch (err) {
          errores++;
          if (errores <= 5) {
            console.error(`❌ Error con RFC ${item.rfc}:`, err.message);
          }
        }
      }

      const procesados = Math.min(i + batchSize, registros.length);
      if (procesados % 500 === 0) {
        console.log(
          `💾 Progreso: ${procesados}/${registros.length} | Insertados: ${insertados} | Actualizados: ${actualizados}`,
        );
      }
    }

    // Restaurar logging
    sequelize.options.logging = loggingOriginal;

    console.log("\n✅ PROCESO COMPLETADO");
    console.log("📊 Resultados:");
    console.log(`   • Total procesados: ${registros.length.toLocaleString()}`);
    console.log(`   • Nuevos insertados: ${insertados.toLocaleString()}`);
    console.log(`   • Actualizados: ${actualizados.toLocaleString()}`);
    console.log(`   • Errores: ${errores}`);

    // Verificar en BD
    const count = await Contribuyente.count();
    console.log(`\n🗄️ Registros totales en BD: ${count.toLocaleString()}`);

    return { total: registros.length, insertados, actualizados };
  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO:");
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
};

// Parser CSV robusto
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

if (require.main === module) {
  processCSV()
    .then(() => {
      console.log("\n🎉 Finalizado");
      process.exit(0);
    })
    .catch(() => process.exit(1));
}

module.exports = { processCSV };
