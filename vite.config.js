import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    host: true,
    port: process.env.PORT || 3000,
    allowedHosts: [
      'mindkind-app-4.onrender.com',
      'mindkind-app-5.onrender.com',
      'mindkind-app.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})
