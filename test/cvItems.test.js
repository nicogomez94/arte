import assert from 'node:assert/strict';
import test from 'node:test';
import { cvItemsToRichText, normalizeCvItem, normalizeCvSections, safeCvHref, sanitizeCvRichText } from '../src/cvItems.js';

test('legacy Bio entries keep their existing automatic links', () => {
  const item = normalizeCvItem('2025 · Talking Pictures · Interview');
  assert.equal(item.title, '2025 · Talking Pictures · Interview');
  assert.equal(item.href, 'https://talking-pictures.online/2025/08/13/andrea-alkalay-sediments-of-time/');
});

test('editable Bio entries preserve their visible title and custom href', () => {
  const item = normalizeCvItem({ title: 'Visible title', href: 'https://example.com/article' });
  assert.deepEqual(item, { title: 'Visible title', href: 'https://example.com/article' });
});

test('Bio sections migrate string entries without changing their order', () => {
  const sections = normalizeCvSections([{ title: 'Section', items: ['First', { title: 'Second', href: '/second' }] }]);
  assert.equal(sections[0].title, 'Section');
  assert.equal(sections[0].titleEs, '');
  assert.equal(sections[0].contentHtml, '<ul><li>First</li><li><a href="/second" target="_blank" rel="noopener noreferrer">Second</a></li></ul>');
  assert.deepEqual(sections[0].items, [
    { title: 'First', href: '' },
    { title: 'Second', href: '/second' }
  ]);
});

test('CV sections preserve independent English and Spanish titles', () => {
  const [section] = normalizeCvSections([{ title: 'Education', titleEs: 'Educación', items: [] }]);
  assert.equal(section.title, 'Education');
  assert.equal(section.titleEs, 'Educación');
});

test('public Bio links allow safe href formats and reject executable schemes', () => {
  assert.equal(safeCvHref('https://example.com'), 'https://example.com');
  assert.equal(safeCvHref('/archivo'), '/archivo');
  assert.equal(safeCvHref('mailto:info@example.com'), 'mailto:info@example.com');
  assert.equal(safeCvHref('javascript:alert(1)'), '');
});

test('CV rich text keeps editorial formatting and removes executable markup', () => {
  const html = sanitizeCvRichText('<p onclick="alert(1)">First</p><script>alert(1)</script><p><strong>Second</strong> <a href="https://example.com" onclick="bad()">link</a></p>');
  assert.equal(html, '<p>First</p><p><strong>Second</strong> <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>');
  assert.deepEqual(normalizeCvItem({ title: 'Entry', contentHtml: html, href: '' }), {
    title: 'Entry',
    href: '',
    contentHtml: html
  });
});

test('CV entry migration keeps safe links inside one rich-text list', () => {
  assert.equal(cvItemsToRichText([
    { title: 'Linked entry', href: 'https://example.com' },
    { title: 'Unsafe entry', href: 'javascript:alert(1)' }
  ]), '<ul><li><a href="https://example.com" target="_blank" rel="noopener noreferrer">Linked entry</a></li><li>Unsafe entry</li></ul>');
});
