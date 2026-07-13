import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    sourcemap: false, // 1. Desactiva los mapas de código que causan el error 'eval'
    cssCodeSplit: true,
    minify: 'esbuild', // 2. Compresión rápida y limpia para producción
  }
})