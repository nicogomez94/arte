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

export const projectGridAssets = {
  'unfixed-landscapes': projectAssets['unfixed-landscapes'].flatMap((slide, index) => {
    if (slide.title === 'Unfixed Landscapes 15') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-15 - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-15 - right.jpg'), slideIndex: index }
      ];
    }
    if (slide.title === 'Unfixed Landscapes 16') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-16 - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-16 - right.jpg'), slideIndex: index }
      ];
    }
    if (slide.title === 'Unfixed Landscapes 18') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-18 - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/unfixed/split-frames/Unfixed Landscapes_wounded systems-18 - right.jpg'), slideIndex: index }
      ];
    }
    return [{ ...slide, slideIndex: index }];
  }),
  'the-rock-cycle': projectAssets['the-rock-cycle'].flatMap((slide, index) => {
    if (slide.title === 'The Rock Cycle 06') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle Bride - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle Bride - right.jpg'), slideIndex: index }
      ];
    }
    if (slide.title === 'The Rock Cycle 08') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle MEMORY Restoration - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle MEMORY Restoration - right.jpg'), slideIndex: index }
      ];
    }
    if (slide.title === 'The Rock Cycle 10') {
      return [
        { ...slide, id: `${slide.id}-left`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle Transitions - left.jpg'), slideIndex: index },
        { ...slide, id: `${slide.id}-right`, imageUrl: asset('/rockcycle/split-frames/Rock Cycle Transitions - right.jpg'), slideIndex: index }
      ];
    }
    return [{ ...slide, slideIndex: index }];
  })
};

const fallbackSlide = ({ slug, title, series = title, year, file }, index = 0) => makeSlide({
  slug,
  title,
  series,
  year,
  technique: 'Exhibition view',
  file
}, index);

export const workIndexItems = [
  { slug: 'unfixed-landscapes', title: 'Unfixed Landscapes', year: 2026, imageUrl: '/andrealkalay-site-first-images/01-unfixed-landscapes.jpg' },
  { slug: 'the-rock-cycle', title: 'The Rock Cycle', year: 2024, imageUrl: '/andrealkalay-site-first-images/02-the-rock-cycle.jpg' },
  { slug: 'unearth', title: 'Unearth / ongoing', year: 2026, imageUrl: '/andrealkalay-site-first-images/03-unearth.jpg' },
  { slug: 'landscape-on-landscape', title: 'Landscape on Landscape', year: 2025, imageUrl: '/andrealkalay-site-first-images/04-landscape-on-landscape.jpg' },
  { slug: 'kutho', title: 'Kutho', year: 2021, imageUrl: '/andrealkalay-site-first-images/05-kutho.jpg' },
  { slug: 'brief-shape', title: 'Brief Shape', year: 2023, imageUrl: '/andrealkalay-site-first-images/06-brief-shape.jpg' },
  { slug: 'urban-territories', title: 'Urban Territories', year: 2018, imageUrl: '/andrealkalay-site-first-images/07-urban-territories.jpg' },
  { slug: 'borders', title: 'Borders', year: 2018, imageUrl: '/andrealkalay-site-first-images/08-borders.jpg' },
  { slug: 'about-india', title: 'About India', year: 2021, imageUrl: '/andrealkalay-site-first-images/09-about-india.jpg' },
  { slug: 'uncertain-nature-book', title: 'Uncertain Nature Book', year: 2022, imageUrl: '/andrealkalay-site-first-images/10-uncertain-nature-book.jpg' }
];

export const exhibitionProjects = [
  { slug: 'recoleta-cultural-center', title: 'Recoleta Cultural Center', year: 2023, imageUrl: '/andrealkalay-site-exhibition-first-images/02-recoleta-cultural-center.jpg' },
  { slug: 'espacio-dar-tucuman', title: 'Espacio DAR / Tucuman', year: 2025, imageUrl: '/andrealkalay-site-exhibition-first-images/03-espacio-dar-tucuman.jpg' },
  { slug: 'park-pecno-slovenia', title: 'Park Pecno Slovenia', year: 2024, imageUrl: '/andrealkalay-site-exhibition-first-images/06-park-pecno-slovenia.jpg' },
  { slug: 'museo-bellas-artes-frankling-rawson', title: 'Museo Bellas Artes Frankling Rawson', year: 2018, imageUrl: '/andrealkalay-site-exhibition-first-images/05-museo-bellas-artes-frankling-rawson.jpg' },
  { slug: 'oda-arte-art-fairs', title: 'OdA Arte. Art FAirs', year: 2021, imageUrl: '/andrealkalay-site-exhibition-first-images/04-oda-arte-art-fairs.jpg' },
  { slug: 'mundo-nuevo-gallery-art', title: 'Mundo Nuevo Gallery Art', year: 2019, imageUrl: '/andrealkalay-site-exhibition-first-images/07-mundo-nuevo-gallery-art.jpg' },
  { slug: 'centro-cultural-mapocho-chile', title: 'Centro Cultural Mapocho CHILE', year: 2018, imageUrl: '/andrealkalay-site-exhibition-first-images/08-centro-cultural-mapocho-chile.jpg' },
  { slug: 'mundo-nuevo-kutho-group-show', title: 'Mundo Nuevo/ Kutho/Group show', year: 2020, imageUrl: '/andrealkalay-site-exhibition-first-images/09-mundo-nuevo-kutho-group-show.jpg' }
];

export const getExhibitionSlides = slug => {
  if (slug === 'recoleta-cultural-center') return exhibitionAssets.filter(item => item.series === 'Recoleta Cultural Center');
  if (slug === 'espacio-dar-tucuman') return exhibitionAssets.filter(item => item.series === 'Espacio DAR / Tucuman');
  if (slug === 'park-pecno-slovenia') return projectAssets['the-rock-cycle'];
  const project = exhibitionProjects.find(item => item.slug === slug);
  if (!project) return [];
  return [fallbackSlide({
    slug: project.slug,
    title: project.title,
    year: project.year,
    file: project.imageUrl
  })];
};
