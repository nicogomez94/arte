const asset = path => encodeURI(path);

const makeSlide = ({ slug, title, series, year, technique, file }, index) => ({
  id: `${slug}-${index + 1}`,
  title,
  series,
  year,
  technique,
  description: series,
  imageUrl: asset(file),
  alt: `${series} ${title}`,
  published: true,
  position: index + 1
});

const unfixedFiles = [
  'Unfixed Landscapes_wounded systems.jpg',
  'Unfixed Landscapes_wounded systems-2.jpg',
  'Unfixed Landscapes_wounded systems-3.jpg',
  'Unfixed Landscapes_wounded systems-4.jpg',
  'Unfixed Landscapes_wounded systems-5.jpg',
  'Unfixed Landscapes_wounded systems-6.jpg',
  'Unfixed Landscapes_wounded systems-7.jpg',
  'Unfixed Landscapes_wounded systems-8.jpg',
  'Unfixed Landscapes_wounded systems-9.jpg',
  'Unfixed Landscapes_wounded systems-10.jpg',
  'Unfixed Landscapes_wounded systems-11.jpg',
  'Unfixed Landscapes_wounded systems-12.jpg',
  'Unfixed Landscapes_wounded systems-13.jpg',
  'Unfixed Landscapes_wounded systems-14.jpg',
  'Unfixed Landscapes_wounded systems-15.jpg',
  'Unfixed Landscapes_wounded systems-16.jpg',
  'Unfixed Landscapes_wounded systems-17.jpg',
  'Unfixed Landscapes_wounded systems-18.jpg',
  'Unfixed Landscapes_wounded systems-19.jpg',
  'Unfixed Landscapes_wounded systems-20.jpg',
  'Unfixed Landscapes_wounded systems-21.jpg',
  'Unfixed Landscapes_wounded systems-22.jpg',
  'Unfixed Landscapes_wounded systems-23.jpg'
];

const rockCycleFiles = [
  'Park Pecno Slovenia_Alkalay _RockCycle_Slovenia Gallery.JPG',
  'Park Pecno Slovenia_Alkalay _RockCycle_Slovenia Gallery EVA2.jpg',
  ' Rock_Cycle_EVA 3.jpg',
  ' Rock_Cycle_EVA 5.jpg',
  ' Rock_Cycle_Memory restoration.jpg',
  'Rock Cycle Bride.jpg',
  'Rock Cycle Crak Path.jpg',
  'Rock Cycle MEMORY Restoration.jpg',
  'Rock Cycle Sealed Wounds.jpg',
  'Rock Cycle Transitions.jpg',
  'Rock Cycle archival.jpg',
  'Rock Cycle archival 2.jpg'
];

const recoletaExhibitionFiles = [
  'DSC08456.JPG',
  'DSC08457.JPG',
  'DSC08458.JPG',
  'DSC08482.JPG',
  'DSC08500.JPG',
  'DSC08515.JPG'
];

const darExhibitionFiles = [
  ' Hall Acceso Espacio DAr Andrea Alkalay 1.JPG',
  ' Hall Acceso Espacio DAr Andrea Alkalay 6.jpg',
  'Hall Der Espacio Dar .JPG',
  'Hall Frente Espacio Dar.JPG',
  'Hall izq Espacio Dar 2.JPG',
  'Landscape on Landscape Espacio DAR 25 2.jpg',
  'Landscape on Landscape Espacio DAR 25.jpg',
  'insta Hall Der Espacio Dar2 .jpg',
  'insta Hall izq Espacio Dar 1.jpg'
];

export const exhibitionAssets = [
  ...recoletaExhibitionFiles.map((file, index) => makeSlide({
    slug: 'recoleta',
    title: `Recoleta Cultural Center ${String(index + 1).padStart(2, '0')}`,
    series: 'Recoleta Cultural Center',
    year: 2023,
    technique: 'Exhibition view',
    file: `/exhibitions/recoleta/${file}`
  }, index)),
  ...darExhibitionFiles.map((file, index) => makeSlide({
    slug: 'dar',
    title: `Espacio DAR / Tucuman ${String(index + 1).padStart(2, '0')}`,
    series: 'Espacio DAR / Tucuman',
    year: 2025,
    technique: 'Exhibition view',
    file: `/exhibitions/dar/${file}`
  }, index))
];

export const projectAssets = {
  'unfixed-landscapes': unfixedFiles.map((file, index) => makeSlide({
    slug: 'unfixed',
    title: `Unfixed Landscapes ${String(index + 1).padStart(2, '0')}`,
    series: 'Unfixed Landscapes',
    year: 2026,
    technique: 'Installation view',
    file: `/unfixed/${file}`
  }, index)),
  'the-rock-cycle': rockCycleFiles.map((file, index) => makeSlide({
    slug: 'rockcycle',
    title: `The Rock Cycle ${String(index + 1).padStart(2, '0')}`,
    series: 'The Rock Cycle',
    year: 2024,
    technique: 'Photography and materiality',
    file: `/rockcycle/${file}`
  }, index))
};
