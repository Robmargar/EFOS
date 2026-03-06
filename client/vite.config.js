// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'curly-trams-stand.loca.lt', // El host específico que te dio el error
      '.loca.lt'                   // O usa el punto inicial para permitir CUALQUIER túnel de localtunnel
    ],
    host: "0.0.0.0",
    port: 5180,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantiene el path /api
      },
    },
  },
});
