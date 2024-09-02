import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Utilise le port défini par Render ou 5173 par défaut
    host: '0.0.0.0', // Nécessaire pour écouter les connexions externes
  },
})
