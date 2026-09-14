import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_NAVIGATION_ORDER, normalizeNavigationOrder } from '../src/navigation.js';

test('default navigation exposes the unified Bio and News sections', () => {
  assert.deepEqual(DEFAULT_NAVIGATION_ORDER, ['work', 'exhibitions', 'bio', 'news', 'workshops', 'contact']);
});

test('stored navigation order is preserved and missing items are restored', () => {
  assert.deepEqual(
    normalizeNavigationOrder(['contact', 'work', 'contact', 'unknown']),
    ['contact', 'work', 'exhibitions', 'bio', 'news', 'workshops']
  );
});
