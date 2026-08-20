// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // assuming React; remove/adjust if Vue/Svelte/etc.
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // <-- Add this!
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          editor: ['react-quill'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
