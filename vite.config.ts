import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // CRITICAL FIX: Use absolute path '/' instead of relative './' to ensure 
  // assets load correctly from any sub-route (e.g. /admin, /login) on Vercel/Netlify.
  base: '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});