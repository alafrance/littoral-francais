import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: "/42-Gaia",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import tailwindcss from '@tailwindcss/vite'
//
// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   server: {
//     host: true,
//     port: 5173,
//     open: false,
//     strictPort: true,
//     watch: {
//       ignored: [
//         '**/node_modules/**',
//         '**/.git/**',
//       ],
//     },
//   },
//   optimizeDeps: {
//     // Exclure OpenLayers du processus d'optimisation
//     exclude: [
//     'ol',
//     ],
//   },
//   build: {
//     sourcemap: false,
//     outDir: 'dist',
//     emptyOutDir: true,
//   },
//   resolve: {
//     alias: {
//       react: path.resolve(__dirname, './node_modules/react'),
//       'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// });
