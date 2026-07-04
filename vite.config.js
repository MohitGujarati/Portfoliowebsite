import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // site is served at https://mohitgujarati.github.io/Portfoliowebsite/
  base: '/Portfoliowebsite/',
  plugins: [react()],
})
