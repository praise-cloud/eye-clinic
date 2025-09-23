import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        auth: resolve(__dirname, 'src/auth.html')
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  base: './'
})