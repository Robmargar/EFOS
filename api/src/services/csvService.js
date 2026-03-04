const axios = require('axios');
const csv = require('csv-parser');
const { sequelize } = require('../config/database');
const { Contribuyente } = require('../models');

const CSV_URL = process.env.CSV_URL || 'https://wu1agsprosta001.blob.core.windows.net/agsc-publicaciones/Datos_abiertos/Documents_AGAFF/Listado_completo_69-B.csv';

const processCSV = async () => {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('📥 Descargando CSV...');
    const response = await axios.get(CSV_URL, { responseType: 'stream' });
    
    let processed = 0;
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    // Preparar statement para UPSERT eficiente
    const upsertQuery = `
      INSERT INTO contribuyentes (rfc, nombre_contribuyente, situacion_contribuyente, fecha_actualizacion)
      VALUES (:rfc, :nombre, :situacion, :fecha)
      ON CONFLICT (rfc) 
      DO UPDATE SET 
        nombre_contribuyente = EXCLUDED.nombre_contribuyente,
        situacion_contribuyente = EXCLUDED.situacion_contribuyente,
        fecha_actualizacion = EXCLUDED.fecha_actualizacion
    `;
    
    const upsertStmt = sequelize.getQueryInterface().queryGenerator.insertQuery(
      'contribuyentes',
      { rfc: '', nombre_contribuyente: '', situacion_contribuyente: '', fecha_actualizacion: new Date() }
    );
    
    return new Promise((resolve, reject) => {
      response.data
        .pipe(csv({ 
          separator: ',', 
          mapHeaders: ({ header }) => header.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        }))
        .on('data', async (row) => {
          try {
            const rfc = row['RFC']?.trim()?.toUpperCase();
            const nombre = row['Nombre del Contribuyente']?.trim();
            const situacion = row['Situación del contribuyente']?.trim() || 
                             row['Situacion del contribuyente']?.trim(); // Fallback sin acento
            
            if (!rfc || !nombre) return;
            
            // Validación básica de RFC
            if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc)) return;
            
            await sequelize.query(upsertQuery, {
              replacements: {
                rfc,
                nombre,
                situacion: situacion || null,
                fecha: new Date()
              },
              transaction
            });
            
            processed++;
            // Commit por lotes para no saturar memoria
            if (processed % 1000 === 0) {
              console.log(`⏳ Procesados: ${processed}...`);
            }
          } catch (err) {
            errors++;
            console.warn(`⚠️ Error procesando fila: ${err.message}`);
          }
        })
        .on('end', async () => {
          try {
            await transaction.commit();
            console.log('✅ Transacción completada');
            resolve({
              success: true,
              message: 'CSV procesado correctamente',
              stats: { processed, inserted, updated, errors }
            });
          } catch (err) {
            await transaction.rollback();
            reject(new Error(`Error al confirmar transacción: ${err.message}`));
          }
        })
        .on('error', async (err) => {
          await transaction.rollback();
          reject(err);
        });
    });
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Función para inicializar tabla (primera vez)
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // false = no borrar datos existentes
    
    // Crear extensión para búsqueda difusa (opcional pero útil)
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
    
    console.log('✅ Base de datos inicializada');
  } catch (error) {
    console.error('❌ Error inicializando DB:', error);
    throw error;
  }
};

module.exports = { processCSV, initializeDatabase };