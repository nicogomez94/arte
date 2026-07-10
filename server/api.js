import crypto from 'node:crypto';
import express from 'express';
import { createStore } from './store.js';

const SESSION_DURATION = 12 * 60 * 60 * 1000;
const CONTENT_SECTIONS = new Set(['global', 'home', 'work', 'exhibitions', 'statement', 'about', 'contact', 'cv']);
const MEDIA_ID = /^[a-f0-9-]{36}$/;

const safeEqual = (left = '', right = '') => {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const parseCookies = header => Object.fromEntries(
  String(header || '').split(';').map(part => part.trim().split('=')).filter(([key, value]) => key && value).map(([key, ...value]) => [key, decodeURIComponent(value.join('='))])
);

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

export const createApi = ({ production = false } = {}) => {
  const router = express.Router();
  const store = createStore({ production });
  const loginAttempts = new Map();
  const adminPassword = process.env.ADMIN_PASSWORD || (production ? '' : 'admin');
  const sessionSecret = process.env.SESSION_SECRET || 'local-development-only';
  const sign = value => crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url');
  const createSession = () => {
    const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_DURATION })).toString('base64url');
    return `${payload}.${sign(payload)}`;
  };
  const validSession = token => {
    try {
      const [payload, signature] = String(token || '').split('.');
      if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
      return Number(JSON.parse(Buffer.from(payload, 'base64url').toString()).exp) > Date.now();
    } catch { return false; }
  };
  const requireAdmin = (req, res, next) => {
    if (!validSession(parseCookies(req.headers.cookie).arte_admin)) return res.status(401).json({ error: 'Sesión no válida.' });
    next();
  };
  const validationError = error => error.message?.startsWith('Ingresá') || error.message?.includes('imagen') || error.message?.includes('año');
  const materializeImages = async value => {
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      const match = value.match(/^data:(image\/(?:webp|jpeg|png|avif));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) throw new Error('El formato de una imagen no es válido.');
      const data = Buffer.from(match[2], 'base64');
      if (!data.length || data.length > 8_000_000) throw new Error('Una imagen supera el límite permitido.');
      const id = crypto.randomUUID();
      await store.saveMedia(id, match[1], data);
      return `/api/media/${id}`;
    }
    if (Array.isArray(value)) return Promise.all(value.map(materializeImages));
    if (value && typeof value === 'object') {
      const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await materializeImages(item)]));
      return Object.fromEntries(entries);
    }
    return value;
  };

  router.use(express.json({ limit: '45mb' }));
  router.get('/api/health', async (_req, res) => {
    try { await store.health(); res.json({ ok: true, storage: store.mode }); }
    catch { res.status(503).json({ ok: false }); }
  });
  router.get('/api/artworks', async (_req, res, next) => {
    try { res.json(await store.publicArtworks()); } catch (error) { next(error); }
  });
  router.get('/api/content', async (_req, res, next) => {
    try { res.json(await store.publicContent()); } catch (error) { next(error); }
  });
  router.get('/api/media/:id', async (req, res, next) => {
    try {
      if (!MEDIA_ID.test(req.params.id)) return res.status(404).end();
      const media = await store.readMedia(req.params.id);
      if (!media) return res.status(404).end();
      res.set('Content-Type', media.mime);
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(media.data);
    } catch (error) { next(error); }
  });
  router.post('/api/admin/login', (req, res) => {
    const key = req.ip || req.socket.remoteAddress;
    const attempt = loginAttempts.get(key) || { count: 0, reset: Date.now() + 15 * 60 * 1000 };
    if (Date.now() > attempt.reset) Object.assign(attempt, { count: 0, reset: Date.now() + 15 * 60 * 1000 });
    if (attempt.count >= 8) return res.status(429).json({ error: 'Demasiados intentos. Probá nuevamente en unos minutos.' });
    if (!adminPassword) return res.status(503).json({ error: 'El acceso todavía no está configurado.' });
    if (!safeEqual(req.body?.password, adminPassword)) {
      attempt.count += 1; loginAttempts.set(key, attempt);
      return res.status(401).json({ error: 'La contraseña no es correcta.' });
    }
    loginAttempts.delete(key);
    res.cookie('arte_admin', createSession(), { httpOnly: true, secure: production, sameSite: 'strict', maxAge: SESSION_DURATION, path: '/' });
    res.json({ ok: true });
  });
  router.post('/api/admin/logout', (_req, res) => { res.clearCookie('arte_admin', { path: '/' }); res.json({ ok: true }); });
  router.get('/api/admin/session', requireAdmin, (_req, res) => res.json({ authenticated: true }));
  router.get('/api/admin/artworks', requireAdmin, async (_req, res, next) => {
    try { res.json(await store.allArtworks()); } catch (error) { next(error); }
  });
  router.get('/api/admin/content', requireAdmin, async (_req, res, next) => {
    try { res.json(await store.publicContent()); } catch (error) { next(error); }
  });
  router.put('/api/admin/content/:section', requireAdmin, async (req, res, next) => {
    try {
      const { section } = req.params;
      if (!CONTENT_SECTIONS.has(section)) return res.status(404).json({ error: 'La sección no existe.' });
      if (!req.body || Array.isArray(req.body) || typeof req.body !== 'object') return res.status(400).json({ error: 'El contenido no es válido.' });
      if (JSON.stringify(req.body).length > 40_000_000) return res.status(413).json({ error: 'La sección supera el límite permitido.' });
      const content = await materializeImages(req.body);
      res.json(await store.updateContent(section, content));
    } catch (error) {
      if (error.message?.includes('imagen')) return res.status(400).json({ error: error.message });
      next(error);
    }
  });
  router.post('/api/admin/artworks', requireAdmin, async (req, res, next) => {
    try { res.status(201).json(await store.create(normalizeArtwork(req.body))); }
    catch (error) { if (validationError(error)) return res.status(400).json({ error: error.message }); next(error); }
  });
  router.put('/api/admin/artworks/:id', requireAdmin, async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const existing = await store.find(id);
      if (!existing) return res.status(404).json({ error: 'La obra no existe.' });
      res.json(await store.update(id, normalizeArtwork(req.body, existing)));
    } catch (error) { if (validationError(error)) return res.status(400).json({ error: error.message }); next(error); }
  });
  router.delete('/api/admin/artworks/:id', requireAdmin, async (req, res, next) => {
    try {
      if (!await store.remove(Number(req.params.id))) return res.status(404).json({ error: 'La obra no existe.' });
      res.status(204).end();
    } catch (error) { next(error); }
  });
  router.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: 'Ocurrió un error inesperado.' }); });

  return { router, store };
};
