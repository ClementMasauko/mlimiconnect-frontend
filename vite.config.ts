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
})