import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // If you want to proxy API during dev (optional)
      // '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
});