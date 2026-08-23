import test from 'node:test';
import assert from 'node:assert/strict';
import { injectCriticalStyles } from '../vite.config.js';

test('critical CSS precedes the deferred full stylesheet', () => {
  const html = '<head><link rel="stylesheet" crossorigin href="/assets/index-test.css"></head>';
  const transformed = injectCriticalStyles(html);

  assert.ok(transformed.indexOf('<style data-critical-home>') < transformed.indexOf('<link rel="preload" as="style"'));
  assert.match(transformed, /@media\(max-width:980px\).*\.header-social-links\{display:none\}/s);
  assert.match(transformed, /<noscript><link rel="stylesheet" href="\/assets\/index-test\.css" \/><\/noscript>/);
});
