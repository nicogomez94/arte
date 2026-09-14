import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultExhibitionLinksForWork, exhibitionsForWork } from '../src/workExhibitions.js';

const exhibitions = [
  { slug: 'unfixed-landscapes-taiwan', title: 'Unfixed Landscapes, Wounded Systems' },
  { slug: 'hafez-gallery', title: 'Hafez Gallery' },
  { slug: 'museo-franklin-rawson', title: 'Urban Territories · Museo Franklin Rawson' }
];

test('work projects resolve their related exhibition pages', () => {
  assert.deepEqual(exhibitionsForWork('unfixed-landscapes', exhibitions), [
    { href: '/exhibitions/unfixed-landscapes-taiwan', title: 'Soulangh Cultural Park / Taiwan' }
  ]);
  assert.deepEqual(exhibitionsForWork('unearth', exhibitions), [
    { href: '/exhibitions/hafez-gallery', title: 'Hafez Gallery / Riyadh' }
  ]);
});

test('urban territories keeps the supplied external exhibition reference', () => {
  const links = exhibitionsForWork('urban-territories', exhibitions);
  assert.equal(links[0].href, '/exhibitions/museo-franklin-rawson');
  assert.equal(links.at(-1).href, 'https://thenewgallery.org/Urban-Territories-Andrea-Alkalay');
});

test('the rock cycle uses the corrected exhibition labels and destinations', () => {
  assert.deepEqual(exhibitionsForWork('the-rock-cycle', exhibitions, 'es'), [
    { href: '/exhibitions/park-pecno-slovenia', title: 'Park Pečno / Eslovenia' },
    { href: '/exhibitions/bienal-sur', title: 'Bienal Sur / Buenos Aires' },
    { href: 'https://www.instagram.com/p/DLa_jqEOAir/', title: 'Museo Arte Al Límite / Chile' }
  ]);
});

test('borders contains the five requested entries and leaves San Martín unlinked', () => {
  const links = exhibitionsForWork('borders', exhibitions, 'es');
  assert.deepEqual(links.map(item => item.title), [
    'Museo de Bellas Artes Franklin Rawson',
    'Centro Cultural Estación Mapocho',
    'Art du Sofitel',
    'Galería Mundo Nuevo',
    'Centro Cultural San Martín'
  ]);
  assert.equal(links.at(-1).href, '');
});

test('a Work project can override its exhibition links with admin-managed content', () => {
  const editableLinks = defaultExhibitionLinksForWork('borders');
  editableLinks[0].labelEs = 'Nombre editado';
  const links = exhibitionsForWork({ slug: 'borders', exhibitionLinks: editableLinks }, exhibitions, 'es');
  assert.equal(links[0].title, 'Nombre editado');
});
