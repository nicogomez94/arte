import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { createApi } from '../server/api.js';
import { mediaTypeFor, mediaValidationError, normalizeProjectMedia, youtubeIdFromUrl, youtubeMediaFromUrl } from '../src/mediaContent.js';
import { MAX_VIDEO_BYTES, parseByteRange, validateVideoUpload } from '../server/media.js';

test('images is the canonical project media list and legacy grid data is removed', () => {
  const project = normalizeProjectMedia({
    title: 'Project',
    images: [{ id: 'main', imageUrl: '/main.jpg', slideIndex: 4 }],
    gridImages: [{ id: 'legacy', imageUrl: '/legacy.jpg', slideIndex: 0 }]
  });
  assert.equal(project.gridImages, undefined);
  assert.deepEqual(project.images, [{ id: 'main', imageUrl: '/main.jpg', mediaType: 'image' }]);
});

test('legacy grid media is recovered only when images is absent', () => {
  const project = normalizeProjectMedia({ gridImages: [{ id: 'legacy', imageUrl: '/movie.webm', slideIndex: 2 }] });
  assert.deepEqual(project.images, [{ id: 'legacy', imageUrl: '/movie.webm', mediaType: 'video' }]);
  assert.equal(mediaTypeFor({ embedUrl: 'https://www.youtube-nocookie.com/embed/mKDtXe9t1eI' }), 'youtube');
});

test('youtube links are accepted from supported URL shapes', () => {
  const id = 'mKDtXe9t1eI';
  [
    id,
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?feature=shared`,
    `https://youtube.com/shorts/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`
  ].forEach(value => assert.equal(youtubeIdFromUrl(value), id));
  assert.equal(youtubeIdFromUrl('https://example.com/watch?v=mKDtXe9t1eI'), null);
  assert.deepEqual(youtubeMediaFromUrl(`https://youtu.be/${id}`, { id: 'item' }), {
    id: 'item',
    mediaType: 'youtube',
    imageUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    posterUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`
  });
  assert.match(mediaValidationError({ mediaType: 'youtube', embedUrl: '' }), /YouTube/);
  assert.match(mediaValidationError({ mediaType: 'video', imageUrl: '' }), /archivo/);
  assert.equal(mediaValidationError({ mediaType: 'image', imageUrl: '/image.jpg' }), null);
});

test('video uploads enforce format and size limits', () => {
  assert.equal(validateVideoUpload('video/mp4', 1024), null);
  assert.equal(validateVideoUpload('video/webm', MAX_VIDEO_BYTES), null);
  assert.match(validateVideoUpload('video/quicktime', 1024), /MP4 o WebM/);
  assert.match(validateVideoUpload('video/mp4', MAX_VIDEO_BYTES + 1), /50 MB/);
  assert.match(validateVideoUpload('video/mp4', 8, Buffer.from('notvideo')), /no coincide/);
});

test('byte ranges support normal, open and suffix requests', () => {
  assert.deepEqual(parseByteRange('bytes=10-19', 100), { start: 10, end: 19 });
  assert.deepEqual(parseByteRange('bytes=90-', 100), { start: 90, end: 99 });
  assert.deepEqual(parseByteRange('bytes=-10', 100), { start: 90, end: 99 });
  assert.equal(parseByteRange('bytes=100-120', 100), null);
  assert.equal(parseByteRange('items=0-2', 100), null);
});

test('authenticated video upload is stored and served with byte ranges', async t => {
  const media = new Map();
  const store = {
    async saveMedia(id, mime, data) { media.set(id, { mime, data }); },
    async readMedia(id) { return media.get(id) || null; }
  };
  const app = express();
  app.use(createApi({ store }).router);
  const server = await new Promise(resolve => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  const login = await fetch(`${base}/api/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'admin' })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const videoBytes = Buffer.concat([Buffer.from([0, 0, 0, 12]), Buffer.from('ftypisom')]);
  const upload = await fetch(`${base}/api/admin/media/video`, {
    method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'video/mp4' }, body: videoBytes
  });
  assert.equal(upload.status, 201);
  const uploaded = await upload.json();
  const ranged = await fetch(`${base}${uploaded.url}`, { headers: { Range: 'bytes=4-7' } });
  assert.equal(ranged.status, 206);
  assert.equal(ranged.headers.get('content-range'), 'bytes 4-7/12');
  assert.equal(ranged.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.equal(await ranged.text(), 'ftyp');
});

test('Contact and CV images are materialized with unique URLs and content responses are never cached', async t => {
  const content = {};
  const media = new Map();
  const store = {
    async publicContent() { return structuredClone(content); },
    async updateContent(section, data) {
      content[section] = structuredClone(data);
      return structuredClone(data);
    },
    async saveMedia(id, mime, data) { media.set(id, { mime, data }); },
    async readMedia(id) { return media.get(id) || null; }
  };
  const app = express();
  app.use(createApi({ store }).router);
  const server = await new Promise(resolve => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  const login = await fetch(`${base}/api/admin/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'admin' })
  });
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const image = 'data:image/png;base64,aW1hZ2UtYnl0ZXM=';

  const saveSection = async section => {
    const response = await fetch(`${base}/api/admin/content/${section}`, {
      method: 'PUT',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: image, imageAlt: section })
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control'), /no-store/);
    return response.json();
  };

  const contact = await saveSection('contact');
  const cv = await saveSection('cv');
  assert.match(contact.imageUrl, /^\/api\/media\/[a-f0-9-]{36}$/);
  assert.match(cv.imageUrl, /^\/api\/media\/[a-f0-9-]{36}$/);
  assert.notEqual(contact.imageUrl, cv.imageUrl);
  assert.equal(media.size, 2);

  const publicResponse = await fetch(`${base}/api/content`);
  assert.match(publicResponse.headers.get('cache-control'), /no-store/);
  const publicContent = await publicResponse.json();
  assert.equal(publicContent.contact.imageUrl, contact.imageUrl);
  assert.equal(publicContent.cv.imageUrl, cv.imageUrl);

  const adminResponse = await fetch(`${base}/api/admin/content`, { headers: { Cookie: cookie } });
  assert.match(adminResponse.headers.get('cache-control'), /no-store/);
  const adminContent = await adminResponse.json();
  assert.equal(adminContent.contact.imageUrl, contact.imageUrl);
  assert.equal(adminContent.cv.imageUrl, cv.imageUrl);
});
