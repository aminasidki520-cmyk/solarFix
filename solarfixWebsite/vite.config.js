import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {                         // intercepte toutes les requêtes commençant par /api
        target: 'http://localhost:8082', // cible du backend
        changeOrigin: true,
        // Pas de rewrite nécessaire si tu conserves le chemin /api
      },
    },
  },
})