import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['cliever.onrender.com'],
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunks for better caching
              'react-vendor': ['react', 'react-dom'],
              'charts': ['recharts'],
              'icons': ['lucide-react']
            }
          }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 600
      }
    };
});
