// src/utils/transformarListadoSAT.js
const fs = require('fs');

const transformarListadoSAT = (csvContent) => {
  if (!csvContent) {
    throw new Error("El contenido del CSV está vacío");
  }

  console.log('🔍 Analizando contenido del CSV...');
  
  // Dividir por líneas
  const lineas = csvContent.split(/\r?\n/);
  
  console.log(`📄 Total de líneas detectadas: ${lineas.length}`);
  
  // Mostrar primeras 5 líneas para debugging
  lineas.slice(0, 5).forEach((linea, index) => {
    console.log(`Línea ${index}: ${linea.substring(0, 100)}...`);
  });

  // Encontrar la línea de encabezados (debe contener "RFC" y "Nombre")
  let indiceEncabezado = -1;
  for (let i = 0; i < Math.min(lineas.length, 20); i++) {
    const linea = lineas[i].toLowerCase();
    if (linea.includes('rfc') && linea.includes('nombre') && linea.includes('contribuyente')) {
      indiceEncabezado = i;
      console.log(`✅ Encabezado encontrado en línea ${i}`);
      break;
    }
  }

  if (indiceEncabezado === -1) {
    console.error('❌ No se encontró la línea de encabezados');
    console.error('Líneas buscadas:');
    lineas.slice(0, 10).forEach((l, i) => console.log(`${i}: ${l}`));
    throw new Error("No se detectó el formato oficial del SAT en el archivo.");
  }

  // Encabezado limpio
  const nuevoEncabezado = "RFC,Nombre del Contribuyente,Situación del contribuyente";

  // Procesar filas de datos
  const filasProcesadas = [];
  let contadorValidos = 0;
  let contadorInvalidos = 0;

  for (let i = indiceEncabezado + 1; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (!linea) continue;

    try {
      // Parsear CSV manejando comillas
      const columnas = parseCSVLine(linea);
      
      if (columnas.length < 4) {
        contadorInvalidos++;
        continue;
      }

      // Columnas según el archivo "Antes":
      // [0] = No
      // [1] = RFC
      // [2] = Nombre del Contribuyente
      // [3] = Situación del contribuyente
      const rfc = columnas[1]?.replace(/"/g, '').trim();
      const nombre = columnas[2]?.replace(/"/g, '').trim();
      const situacion = columnas[3]?.replace(/"/g, '').trim();

      // Validar RFC (debe tener 12-13 caracteres y ser alfanumérico)
      if (rfc && nombre && rfc.length >= 12 && rfc.length <= 13 && /^[A-Z0-9]+$/.test(rfc)) {
        // Escapar comillas en el nombre si es necesario
        const nombreEscapado = nombre.includes(',') ? `"${nombre}"` : nombre;
        filasProcesadas.push(`${rfc},${nombreEscapado},${situacion}`);
        contadorValidos++;
      } else {
        contadorInvalidos++;
      }
    } catch (error) {
      // Ignorar líneas con errores de parsing
      contadorInvalidos++;
    }

    // Progreso cada 1000 registros
    if ((i - indiceEncabezado) % 1000 === 0 && (i - indiceEncabezado) > 0) {
      console.log(`⏳ Procesadas ${i - indiceEncabezado} líneas...`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   • Válidos: ${contadorValidos}`);
  console.log(`   • Inválidos/Saltados: ${contadorInvalidos}`);

  if (filasProcesadas.length === 0) {
    throw new Error("No se encontraron registros válidos en el CSV");
  }

  // Unir todo
  return [nuevoEncabezado, ...filasProcesadas].join('\n');
};

// Función auxiliar para parsear una línea CSV respetando comillas
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

module.exports = transformarListadoSAT;