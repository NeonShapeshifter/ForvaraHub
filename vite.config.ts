import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion', 'date-fns'],
          'vendor-utils': ['zustand', '@radix-ui/react-select', '@radix-ui/react-dialog'],
          
          // Page chunks for code splitting
          'auth-pages': ['./src/pages/Login.tsx', './src/pages/Register.tsx'],
          'main-pages': ['./src/pages/Dashboard.tsx', './src/pages/Marketplace.tsx'],
          'management-pages': ['./src/pages/Users.tsx', './src/pages/Companies.tsx', './src/pages/Settings.tsx'],
          'admin-pages': ['./src/pages/AdminDashboard.tsx', './src/pages/Analytics.tsx']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Disable source maps for production
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})