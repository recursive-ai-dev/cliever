import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['cliever.onrender.com'],
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id: string) {
              // Vendor chunks for better caching. Function form handles
              // subpath imports (react/jsx-runtime, react-dom/client) and
              // transitive chart dependencies that package-name matching misses.
              if (id.includes('node_modules')) {
                if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
                if (/[\\/]node_modules[\\/](recharts|d3-[^\\/]*|victory-vendor|react-is|decimal\.js-light|tiny-invariant)[\\/]/.test(id)) return 'charts';
                if (id.includes('lucide-react')) return 'icons';
              }
              return undefined;
            }
          }
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 600
      }
    };
});
