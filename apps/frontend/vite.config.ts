import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // Disable HMR when running inside Docker (no file-watch events reach the container)
    hmr: process.env.DOCKER ? false : true,
    proxy: {
      // Forward all /api requests to the Express server
      // Works both locally (localhost:3001) and in Docker (http://api:3001)
      '/api': {
        target: process.env.API_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
