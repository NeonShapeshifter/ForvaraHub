import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion', 'date-fns'],
          'vendor-utils': ['zustand', '@radix-ui/react-select', '@radix-ui/react-dialog']
          // Temporarily disable page chunks to fix production issues
          // 'auth-pages': ['./src/pages/Login.tsx', './src/pages/Register.tsx'],
          // 'main-pages': ['./src/pages/Dashboard.tsx', './src/pages/Marketplace.tsx'],
          // 'management-pages': ['./src/pages/Users.tsx', './src/pages/Companies.tsx', './src/pages/Settings.tsx'],
          // 'admin-pages': ['./src/pages/AdminDashboard.tsx', './src/pages/Analytics.tsx']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging production issues
    sourcemap: true,
    // Optimize CSS
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging production issues
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
