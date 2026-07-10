import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { defaultArtworks } from './defaultArtworks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localFile = path.resolve(__dirname, '../.local/artworks.json');
const localContentFile = path.resolve(__dirname, '../.local/site-content.json');
const localMediaDirectory = path.resolve(__dirname, '../.local/media');
const byPosition = (a, b) => a.position - b.position || a.id - b.id;

const createLocalStore = () => {
  const readContent = async () => {
    try { return JSON.parse(await fs.readFile(localContentFile, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; return {}; }
  };
  const writeContent = async content => {
    await fs.mkdir(path.dirname(localContentFile), { recursive: true });
    await fs.writeFile(localContentFile, JSON.stringify(content, null, 2));
  };
  const read = async () => {
    try {
      return JSON.parse(await fs.readFile(localFile, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await fs.mkdir(path.dirname(localFile), { recursive: true });
      await fs.writeFile(localFile, JSON.stringify(defaultArtworks, null, 2));
      return structuredClone(defaultArtworks);
    }
  };

  const write = async artworks => {
    await fs.mkdir(path.dirname(localFile), { recursive: true });
    await fs.writeFile(localFile, JSON.stringify(artworks, null, 2));
  };

  return {
    mode: 'local-json',
    async health() { return true; },
    async publicContent() { return readContent(); },
    async updateContent(section, data) {
      const content = await readContent();
      content[section] = data;
      await writeContent(content);
      return data;
    },
    async saveMedia(id, mime, data) {
      await fs.mkdir(localMediaDirectory, { recursive: true });
      await Promise.all([
        fs.writeFile(path.join(localMediaDirectory, id), data),
        fs.writeFile(path.join(localMediaDirectory, `${id}.json`), JSON.stringify({ mime }))
      ]);
    },
    async readMedia(id) {
      try {
        const [data, metadata] = await Promise.all([
          fs.readFile(path.join(localMediaDirectory, id)),
          fs.readFile(path.join(localMediaDirectory, `${id}.json`), 'utf8')
        ]);
        return { data, mime: JSON.parse(metadata).mime };
      } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    },
    async publicArtworks() { return (await read()).filter(item => item.published).sort(byPosition); },
    async allArtworks() { return (await read()).sort(byPosition); },
    async find(id) { return (await read()).find(item => item.id === id) || null; },
    async create(data) {
      const artworks = await read();
      const id = artworks.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const artwork = { ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      artworks.push(artwork);
      await write(artworks);
      return artwork;
    },
    async update(id, data) {
      const artworks = await read();
      const index = artworks.findIndex(item => item.id === id);
      if (index === -1) return null;
      artworks[index] = { ...artworks[index], ...data, id, updatedAt: new Date().toISOString() };
      await write(artworks);
      return artworks[index];
    },
    async remove(id) {
      const artworks = await read();
      const filtered = artworks.filter(item => item.id !== id);
      if (filtered.length === artworks.length) return false;
      await write(filtered);
      return true;
    },
    async disconnect() {}
  };
};

const createPrismaStore = () => {
  const prisma = new PrismaClient();
  return {
    mode: 'postgresql',
    async health() { await prisma.$queryRaw`SELECT 1`; return true; },
    async publicContent() {
      const sections = await prisma.siteContent.findMany();
      return Object.fromEntries(sections.map(item => [item.section, item.data]));
    },
    async updateContent(section, data) {
      const saved = await prisma.siteContent.upsert({
        where: { section }, update: { data }, create: { section, data }
      });
      return saved.data;
    },
    async saveMedia(id, mime, data) { await prisma.siteMedia.create({ data: { id, mime, data } }); },
    async readMedia(id) { return prisma.siteMedia.findUnique({ where: { id }, select: { mime: true, data: true } }); },
    publicArtworks: () => prisma.artwork.findMany({ where: { published: true }, orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }),
    allArtworks: () => prisma.artwork.findMany({ orderBy: [{ position: 'asc' }, { createdAt: 'asc' }] }),
    find: id => prisma.artwork.findUnique({ where: { id } }),
    create: data => prisma.artwork.create({ data }),
    update: (id, data) => prisma.artwork.update({ where: { id }, data }),
    async remove(id) { await prisma.artwork.delete({ where: { id } }); return true; },
    disconnect: () => prisma.$disconnect()
  };
};

export const createStore = ({ production = false } = {}) => (
  production || process.env.DATABASE_URL ? createPrismaStore() : createLocalStore()
);
