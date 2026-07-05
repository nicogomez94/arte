import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const SESSION_DURATION = 12 * 60 * 60 * 1000;

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '9mb' }));

const safeEqual = (left = '', right = '') => {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const sign = value => crypto
  .createHmac('sha256', process.env.SESSION_SECRET || 'local-development-only')
  .update(value)
  .digest('base64url');

const parseCookies = header => Object.fromEntries(
  String(header || '')
    .split(';')
    .map(part => part.trim().split('='))
    .filter(([key, value]) => key && value)
    .map(([key, ...value]) => [key, decodeURIComponent(value.join('='))])
);

const createSession = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_DURATION })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};

const validSession = token => {
  try {
    const [payload, signature] = String(token || '').split('.');
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return Number(session.exp) > Date.now();
  } catch {
    return false;
  }
};

const requireAdmin = (req, res, next) => {
  const token = parseCookies(req.headers.cookie).arte_admin;
  if (!validSession(token)) return res.status(401).json({ error: 'Sesión no válida.' });
  next();
};

const normalizeArtwork = (body, existing = {}) => {
  const title = String(body.title ?? existing.title ?? '').trim();
  const series = String(body.series ?? existing.series ?? '').trim();
  const imageUrl = String(body.imageUrl ?? existing.imageUrl ?? '').trim();
  const yearValue = body.year === '' || body.year == null ? null : Number(body.year);

  if (!title || title.length > 140) throw new Error('Ingresá un título de hasta 140 caracteres.');
  if (!series || series.length > 100) throw new Error('Ingresá una serie de hasta 100 caracteres.');
  if (!imageUrl || imageUrl.length > 8_000_000) throw new Error('La imagen falta o supera el límite permitido.');
  if (!imageUrl.startsWith('/') && !imageUrl.startsWith('data:image/')) throw new Error('El formato de imagen no es válido.');
  if (yearValue !== null && (!Number.isInteger(yearValue) || yearValue < 1900 || yearValue > 2100)) throw new Error('El año no es válido.');

  return {
    title,
    series,
    imageUrl,
    year: yearValue,
    technique: String(body.technique ?? existing.technique ?? '').trim().slice(0, 140) || null,
    description: String(body.description ?? existing.description ?? '').trim().slice(0, 1200) || null,
    alt: String(body.alt ?? existing.alt ?? '').trim().slice(0, 220) || title,
    published: body.published === undefined ? (existing.published ?? true) : Boolean(body.published),
    position: Number.isInteger(Number(body.position)) ? Number(body.position) : (existing.position ?? 0)
  };
};

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.get('/api/artworks', async (_req, res, next) => {
  try {
    const artworks = await prisma.artwork.findMany({
      where: { published: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }]
    });
    res.json(artworks);
  } catch (error) { next(error); }
});

const loginAttempts = new Map();
app.post('/api/admin/login', (req, res) => {
  const key = req.ip;
  const attempt = loginAttempts.get(key) || { count: 0, reset: Date.now() + 15 * 60 * 1000 };
  if (Date.now() > attempt.reset) Object.assign(attempt, { count: 0, reset: Date.now() + 15 * 60 * 1000 });
  if (attempt.count >= 8) return res.status(429).json({ error: 'Demasiados intentos. Probá nuevamente en unos minutos.' });

  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'El acceso todavía no está configurado.' });
  if (!safeEqual(req.body?.password, process.env.ADMIN_PASSWORD)) {
    attempt.count += 1;
    loginAttempts.set(key, attempt);
    return res.status(401).json({ error: 'La contraseña no es correcta.' });
  }

  loginAttempts.delete(key);
  res.cookie('arte_admin', createSession(), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/'
  });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie('arte_admin', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/admin/session', requireAdmin, (_req, res) => res.json({ authenticated: true }));

app.get('/api/admin/artworks', requireAdmin, async (_req, res, next) => {
  try {
    res.json(await prisma.artwork.findMany({ orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }));
  } catch (error) { next(error); }
});

app.post('/api/admin/artworks', requireAdmin, async (req, res, next) => {
  try {
    const data = normalizeArtwork(req.body);
    const artwork = await prisma.artwork.create({ data });
    res.status(201).json(artwork);
  } catch (error) {
    if (error.message?.startsWith('Ingresá') || error.message?.includes('imagen') || error.message?.includes('año')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

app.put('/api/admin/artworks/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.artwork.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'La obra no existe.' });
    const artwork = await prisma.artwork.update({ where: { id }, data: normalizeArtwork(req.body, existing) });
    res.json(artwork);
  } catch (error) {
    if (error.message?.startsWith('Ingresá') || error.message?.includes('imagen') || error.message?.includes('año')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

app.delete('/api/admin/artworks/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.artwork.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (error) { next(error); }
});

if (isProduction) {
  app.use(express.static(distPath, { maxAge: '1h', index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Ocurrió un error inesperado.' });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Andrea Alkalay app listening on ${port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
