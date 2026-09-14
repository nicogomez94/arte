import assert from 'node:assert/strict';
import test from 'node:test';
import { exhibitionsForWork } from '../src/workExhibitions.js';

const exhibitions = [
  { slug: 'unfixed-landscapes-taiwan', title: 'Unfixed Landscapes, Wounded Systems' },
  { slug: 'hafez-gallery', title: 'Hafez Gallery' },
  { slug: 'museo-franklin-rawson', title: 'Urban Territories · Museo Franklin Rawson' }
];

test('work projects resolve their related exhibition pages', () => {
  assert.deepEqual(exhibitionsForWork('unfixed-landscapes', exhibitions), [
    { slug: 'unfixed-landscapes-taiwan', title: 'Unfixed Landscapes, Wounded Systems' }
  ]);
  assert.deepEqual(exhibitionsForWork('unearth', exhibitions), [
    { slug: 'hafez-gallery', title: 'Hafez Gallery' }
  ]);
});

test('urban territories keeps the supplied external exhibition reference', () => {
  const links = exhibitionsForWork('urban-territories', exhibitions);
  assert.equal(links[0].slug, 'museo-franklin-rawson');
  assert.equal(links.at(-1).href, 'https://thenewgallery.org/Urban-Territories-Andrea-Alkalay');
});
