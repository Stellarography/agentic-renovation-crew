import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            sourcemap: process.env.NODE_ENV === 'development', // Enable for debugging
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist/electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      },
      {
        entry: 'electron/preload.ts',
        vite: {
          build: {
            sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false, // Debug in dev
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist/electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true, // Fail if port is taken, avoiding conflicts
    hmr: {
      port: 5173 // Ensure HMR uses the same port
    }
  },
  build: {
    outDir: 'dist/renderer'
  }
})