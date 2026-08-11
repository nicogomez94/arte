import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_NAVIGATION_ORDER, normalizeNavigationOrder } from '../src/navigation.js';

test('default navigation places CV immediately before Contact', () => {
  const cvIndex = DEFAULT_NAVIGATION_ORDER.indexOf('cv');
  assert.equal(DEFAULT_NAVIGATION_ORDER[cvIndex + 1], 'contact');
});

test('stored navigation order is preserved and missing items are restored', () => {
  assert.deepEqual(
    normalizeNavigationOrder(['contact', 'work', 'contact', 'unknown']),
    ['contact', 'work', 'exhibitions', 'statement', 'workshops', 'cv']
  );
});
