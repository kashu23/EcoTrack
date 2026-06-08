import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  server: { port: 5173 },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    force: true
  },
  ssr: {
    // Keep Vite dev dependency graph stable in this environment
    noExternal: []
  },
  build: {
    sourcemap: true
  }
})




