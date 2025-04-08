import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Gérer les alias correctement

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: false,
    strictPort: true,
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      'ol',  // Exclure OpenLayers du processus d'optimisation
    ],
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
});
