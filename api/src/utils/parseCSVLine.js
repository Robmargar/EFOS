// src/utils/parseCSVLine.js
/**
 * Parsea una línea CSV respetando comillas dobles
 * Ej: '1,AAA080808,"NOMBRE, CON COMA",Definitivo'
 * → ['1', 'AAA080808', 'NOMBRE, CON COMA', 'Definitivo']
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      // Comilla escapada ""
      current += '"';
      i++; // Saltar siguiente comilla
    } else if (char === '"') {
      // Toggle estado de comillas
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      // Separador válido (fuera de comillas)
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Agregar último campo
  result.push(current.trim());

  return result;
};

module.exports = parseCSVLine;
