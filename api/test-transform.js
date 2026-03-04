const axios = require("axios");

const CSV_URL =
  "https://wu1agsprosta001.blob.core.windows.net/agsc-publicaciones/Datos_abiertos/Documents_AGAFF/Listado_completo_69-B.csv";

axios
  .get(CSV_URL, { responseType: "text" })
  .then((response) => {
    const lineas = response.data.split(/\r?\n/).slice(0, 10);
    console.log("PRIMERAS 10 LÍNEAS DEL CSV:");
    console.log("===========================\n");
    lineas.forEach((linea, i) => {
      console.log(`Línea ${i}:`);
      console.log(linea);
      console.log("---");
    });
  })
  .catch(console.error);
