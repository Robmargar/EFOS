export default function exportarContribuyentesCSV(data) {
  if (!data || !data.length) return;

  // 1. Diccionario para nombres de columnas amigables
  const mapeoEncabezados = {
    rfc: "RFC",
    nombre_contribuyente: "Nombre o Razón Social",
    situacion_contribuyente: "Estado",
    fecha_actualizacion: "Fecha de Actualización"
  };

  // 2. Definimos el orden de las llaves que queremos procesar
  const keys = Object.keys(mapeoEncabezados);

  // 3. Creamos la línea de cabeceras
  const headers = keys.map(key => mapeoEncabezados[key]).join(",");

  // 4. Procesamos las filas con lógica de formato
  const rows = data.map(obj => {
    return keys.map(key => {
      let valor = obj[key];

      // --- Lógica especial para la FECHA ---
      if (key === 'fecha_actualizacion' && valor) {
        const fecha = new Date(valor);
        // Formato: DD/MM/YYYY
        valor = fecha.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      // Limpiamos el valor (manejo de nulos y escape de comillas)
      const cadena = valor ? String(valor).replace(/"/g, '""') : "";
      return `"${cadena}"`;
    }).join(",");
  });

  // 5. Unimos todo con el BOM (para tildes en Excel) y saltos de línea
  const csvContent = "\ufeff" + [headers, ...rows].join("\n");

  // 6. Proceso de descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `Reporte_Contribuyentes_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Ejecución
