import assert from 'node:assert/strict';
import test from 'node:test';
import { injectSeoHead, publicProjects, seoForPath, sitemapXml } from '../server/seo.js';
import { projectAssets } from '../src/projectAssets.js';

const sitemapPaths = xml => [...xml.matchAll(/<loc>https:\/\/andrealkalay\.com([^<]*)<\/loc>/g)]
  .map(match => match[1] || '/');

test('every sitemap URL has unique indexable metadata and canonical URL', () => {
  const paths = sitemapPaths(sitemapXml({}));
  const pages = paths.map(path => seoForPath(path, {}));

  assert.equal(paths.length, 33);
  assert.equal(new Set(pages.map(page => page.title)).size, pages.length);
  assert.equal(new Set(pages.map(page => page.description)).size, pages.length);
  assert.equal(new Set(pages.map(page => page.path)).size, pages.length);
  pages.forEach(page => {
    assert.equal(page.valid, true);
    assert.equal(page.noIndex, false);
    assert.ok(page.title);
    assert.ok(page.description);
    assert.ok(page.image);
  });
});

test('unknown and private routes are excluded from indexing', () => {
  assert.deepEqual(
    { valid: seoForPath('/missing', {}).valid, noIndex: seoForPath('/missing', {}).noIndex },
    { valid: false, noIndex: true }
  );
  assert.equal(seoForPath('/work/missing', {}).noIndex, true);
  assert.equal(seoForPath('/admin', {}).noIndex, true);
});

test('server-rendered head includes canonical, Open Graph and valid JSON-LD', () => {
  const seo = seoForPath('/work/the-rock-cycle', {});
  const html = injectSeoHead('<head><!--seo:head:start--><!--seo:head:end--></head>', seo);
  assert.match(html, /<title>The Rock Cycle · Andrea Alkalay<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/andrealkalay\.com\/work\/the-rock-cycle"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/andrealkalay\.com\/optimized\/work-the-rock-cycle-cover\.webp"/);
  const json = html.match(/<script id="seo-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.equal(JSON.parse(json)['@context'], 'https://schema.org');
});

test('legacy default covers upgrade to clean WebP URLs without replacing custom admin covers', () => {
  const legacy = publicProjects({
    work: { projects: [{ slug: 'the-rock-cycle', imageUrl: projectAssets['the-rock-cycle'][0].imageUrl }] }
  }).work.find(project => project.slug === 'the-rock-cycle');
  const custom = publicProjects({
    work: { projects: [{ slug: 'the-rock-cycle', imageUrl: '/api/media/custom-cover' }] }
  }).work.find(project => project.slug === 'the-rock-cycle');

  assert.equal(legacy.imageUrl, '/optimized/work-the-rock-cycle-cover.webp');
  assert.equal(custom.imageUrl, '/api/media/custom-cover');
});
