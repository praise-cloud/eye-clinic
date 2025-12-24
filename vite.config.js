import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    strictPort: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  base: './'
})
=======
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  base: './'
})
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
