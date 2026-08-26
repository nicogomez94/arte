import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApi } from './api.js';
import { legacyDestination } from './legacyRedirects.js';
import { injectSeoHead, seoForPath, sitemapXml } from './seo.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const production = process.env.NODE_ENV === 'production' || Boolean(process.env.DATABASE_URL);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const { router, store } = createApi({ production });
const indexTemplate = fs.readFile(path.join(distPath, 'index.html'), 'utf8');

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req, res, next) => {
  const host = String(req.get('host') || '').split(':')[0].toLowerCase();
  const protocol = String(req.get('x-forwarded-proto') || req.protocol).split(',')[0].trim();
  const legacyPath = legacyDestination(req.path);
  const query = req.originalUrl.slice(req.path.length);
  if ((host === 'www.andrealkalay.com' || host === 'andrealkalay.com') && (host !== 'andrealkalay.com' || protocol !== 'https')) {
    return res.redirect(301, `https://andrealkalay.com${legacyPath || req.path}${query}`);
  }
  if (legacyPath) return res.redirect(301, `${legacyPath}${query}`);
  if (!req.path.startsWith('/api/') && req.path.length > 1 && req.path.endsWith('/')) {
    return res.redirect(301, `${req.path.replace(/\/+$/, '')}${query}`);
  }
  next();
});
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://andrealkalay.com/sitemap.xml\n');
});
app.get('/sitemap.xml', async (_req, res, next) => {
  try {
    res.set('Cache-Control', 'public, max-age=3600').type('application/xml').send(sitemapXml(await store.publicContent()));
  } catch (error) { next(error); }
});
app.use('/api', (_req, res, next) => { res.set('X-Robots-Tag', 'noindex, nofollow'); next(); });
app.use(router);
app.use(express.static(distPath, {
  maxAge: '30d',
  index: false,
  redirect: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  }
}));
app.use(async (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method) || req.path.startsWith('/api/')) return next();
  try {
    const storedContent = await store.publicContent();
    const seo = seoForPath(req.path, storedContent);
    if (seo.noIndex) res.set('X-Robots-Tag', 'noindex, nofollow');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(seo.valid ? 200 : 404).type('html').send(injectSeoHead(await indexTemplate, seo));
  } catch (error) { next(error); }
});

const server = app.listen(port, '0.0.0.0', () => console.log(`Andrea Alkalay app listening on ${port}`));
const shutdown = () => server.close(async () => { await store.disconnect(); process.exit(0); });
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
