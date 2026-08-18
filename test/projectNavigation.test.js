import assert from 'node:assert/strict';
import test from 'node:test';
import { nextProjectInSequence, toMasonryColumns } from '../src/projectNavigation.js';

const projects = ['unfixed', 'rock-cycle', 'unearth', 'landscape', 'kutho'].map(slug => ({ slug }));

test('masonry columns retain the canonical source order for mobile flattening', () => {
  const columns = toMasonryColumns(projects);
  assert.deepEqual(columns.map(column => column.map(entry => entry.item.slug)), [
    ['unfixed', 'kutho'],
    ['rock-cycle'],
    ['unearth'],
    ['landscape']
  ]);
  assert.deepEqual(columns.flat().sort((a, b) => a.sourceIndex - b.sourceIndex).map(entry => entry.item.slug), projects.map(project => project.slug));
});

test('next project follows the configured order and wraps at the end', () => {
  assert.equal(nextProjectInSequence(projects, 'unfixed').slug, 'rock-cycle');
  assert.equal(nextProjectInSequence(projects, 'kutho').slug, 'unfixed');
  assert.equal(nextProjectInSequence([{ slug: 'only' }], 'only'), null);
});
