import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeCvItem, normalizeCvSections, safeCvHref } from '../src/cvItems.js';

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
  assert.deepEqual(sections[0].items, [
    { title: 'First', href: '' },
    { title: 'Second', href: '/second' }
  ]);
});

test('public Bio links allow safe href formats and reject executable schemes', () => {
  assert.equal(safeCvHref('https://example.com'), 'https://example.com');
  assert.equal(safeCvHref('/archivo'), '/archivo');
  assert.equal(safeCvHref('mailto:info@example.com'), 'mailto:info@example.com');
  assert.equal(safeCvHref('javascript:alert(1)'), '');
});
