import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { createApi } from './server/api.js';

const localApi = () => ({
  name: 'andrea-alkalay-local-api',
  configureServer(server) {
    const { router } = createApi({ production: false });
    const api = express();
    api.use(router);
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next();
      api(req, res, next);
    });
  }
});

export default defineConfig({
  plugins: [react(), localApi()],
  publicDir: 'assets',
  server: {
    port: 4173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  }
});
