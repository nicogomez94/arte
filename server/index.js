import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApi } from './api.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const { router, store } = createApi({ production: true });

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(router);
app.use(express.static(distPath, { maxAge: '1h', index: false }));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(port, '0.0.0.0', () => console.log(`Andrea Alkalay app listening on ${port}`));
const shutdown = () => server.close(async () => { await store.disconnect(); process.exit(0); });
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
