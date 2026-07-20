// Encode each path segment independently so reserved characters that are valid
// in asset filenames (for example `#` in the Landscape series) are not treated
// as URL fragments by the browser.
const asset = path => path.split('/').map(segment => encodeURIComponent(segment)).join('/');

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

const workFiles = {
  'unfixed-landscapes': {
    slug: 'unfixed',
    title: 'Unfixed Landscapes',
    year: 2026,
    technique: 'Installation view',
    base: '/works/works2/wix unfixed',
    files: [
      'Unfixed Landscapes_wounded systems 1-Installation View.jpg',
      'Unfixed Landscapes_wounded systems 2_SUSPENDED FOREST.jpg',
      'Unfixed Landscapes_wounded systems 3 SUSPENDED FOREST.jpg',
      'Unfixed Landscapes_wounded systems 4-SOLAR READINGS.jpg',
      'Unfixed Landscapes_wounded systems 5 LIQUID READINGS.jpg',
      'Unfixed Landscapes_wounded systems 6 SURFACE READINGS.JPG',
      'Unfixed Landscapes_wounded systems 7 SURFACE READINGS.jpg',
      'Unfixed Landscapes_wounded systems 8 OYSTER FARM.jpg',
      'Unfixed Landscapes_wounded systems 9 ACTIVE PEELINGS.jpg',
      'Unfixed Landscapes_wounded systems 10 MATERIAL RECORDS.jpg',
      'Unfixed Landscapes_wounded systems 11 GHOST MONEY.jpg',
      'Unfixed Landscapes_wounded systems-12 TYPHON TREE .jpg',
      'Unfixed Landscapes_wounded systems-13 RIZOMA.jpg',
      'Unfixed Landscapes_wounded systems-14 ASH RECORDS.jpg',
      'Unfixed Landscapes_wounded systems-15 SHIFTING SOVEREIGNTIES.jpg',
      'Unfixed Landscapes_wounded systems-16 THE RESIDUAL.jpg'
    ]
  },
  'the-rock-cycle': {
    slug: 'rockcycle',
    title: 'The Rock Cycle',
    year: 2024,
    technique: 'Photography and materiality',
    base: '/works/works2/Wix Rock Cycle',
    files: [
      'Rock Cycle 1 Crak Path.jpg',
      'Rock Cycle 2 Transitions.jpg',
      'Rock Cycle 3 The Bride of the Red Sea.jpg',
      'Rock Cycle 4 MEMORY Restoration.jpg',
      'Rock Cycle 5 Sealed Wounds.jpg',
      'Rock Cycle 6 EVA.jpg',
      'Rock Cycle 6 EVA copy.jpg',
      'Rock Cycle 7 EVA 2.jpg',
      'Rock Cycle 8 archival 2.jpg',
      'Rock Cycle 9 archival.jpg'
    ]
  },
  unearth: {
    slug: 'unearth',
    title: 'Unearth',
    year: 2026,
    technique: 'Ongoing research',
    base: '/works/works2/wix Unearth',
    files: [
      'Unearth_1 The sedimented Nature of Objects.jpg',
      'Unearth_1b  The sedimented Nature of Objects 2.jpg',
      'Unearth_2 Textus.jpg',
      'Unearth_3_Construction Remans.jpg',
      'Unearth_4 Stacking the urban landscape.jpg',
      'Unearth_5 The delicated nature of the built enviroment .jpg',
      'Unearth_6 _Roots.jpg',
      'Unearth_7 Weaving & Unraveling The Rocks .jpg',
      'Unearth_8 .jpg',
      'Unearth_9 .jpg',
      'Unearth_10 .jpg',
      'Unearth_11 .jpg',
      'Unearth_12 .jpg',
      'Unearth_13.jpg',
      'Unearth_14 .jpg',
      'Unearth_15.jpg'
    ]
  },
  'landscape-on-landscape': {
    slug: 'landscape',
    title: 'Landscape on Landscape',
    year: 2025,
    technique: 'Photography and intervention',
    base: '/works/works2/wix Landscape',
    files: [
      '1 - Landscape on Landscape Centro Cultural Recoleta.jpg',
      '2- Landscape_on Landscape_Cod-ffc633.jpg',
      '3- Landscape_on_Lanscape_4795C.jpg',
      '4 Landscape_on Landscape_Cod-7fab79.jpg',
      '5 Landscape on Landscape _Cod-f9b6b0 .jpg',
      '6- Paiseje sobre Paisaje Cod-bec2f6.jpg',
      '7- LandscapeOnLandscape1F7C29F.jpg',
      '8 Landscape_on Landscape_Cod-d3fa80.jpg',
      '9 Landscape on Landscape Cod-B00c48.jpg',
      '10- Landscape_on_Lanscape_59392C.jpg',
      '11 Landscape_on_Landscape_F7C29F.jpg',
      '12 Landscape_on_Landscape_91CCF0.jpg',
      '13 Landscape_on_Landscape f6be57.jpg',
      '14 Landscape_on_Landscape_52EA30.jpg',
      '15 Landscape_on_Landscape_3FA3DF.jpg',
      '16 Landscape_on Landscape_Cod-aba1c0.jpg',
      '17 LAndscape_on_Lanscape_807917.jpg',
      '18- Landscape_on_Lanscape_CCCFCA.jpg',
      '19 Landscape_on Landscape_2 .jpg',
      '20 Landscape_on_Lanscape_2852cc.jpg',
      '21 Landscape_on_landscape-F1671c.jpg',
      '22 Landscape_on Landscape_Cod-B6D3F0 .jpg',
      '23 Landscape_on_landscape_Cod-DAD0B0.jpg',
      '24 Landscape on Landscape Espacio DAR 25.jpg'
    ]
  },
  kutho: {
    slug: 'kutho',
    title: 'Kutho',
    year: 2021,
    technique: 'Photography',
    base: '/works/works1/wix kutho',
    files: [
      '1 Kutho_Portraits.jpg',
      '2 Kutho Vertical a.jpg',
      '3 Kutho Vertical b.jpg',
      '4 Kutho Vertical c.jpg',
      '5 Kutho Vertical x 18.jpg',
      '6 Kutho Horizobtal a.jpg',
      '7 Kutho Horizobtal b.jpg',
      '8 Kutho Horizobtal c.jpg',
      '9 Kutho gold.jpg'
    ]
  },
  'brief-shape': {
    slug: 'brief-shape',
    title: 'Brief Shape',
    year: 2023,
    technique: 'Photography and installation',
    base: '/works/works1/ Brief Form',
    files: [
      '0.jpg',
      '1.jpg',
      '1-a.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '12.jpg',
      '13.jpg',
      '14.jpg',
      '15 POP UP BAPhoto _ OdA Arte.jpg'
    ]
  },
  'urban-territories': {
    slug: 'urban-territories',
    title: 'Urban Territories',
    year: 2018,
    technique: 'Photography',
    base: '/works/works1/Urban Territories',
    files: [
      'Urban_territories_1.jpg',
      'Urban_territories_2.jpg',
      'Urban_territories_3.jpg',
      'Urban_territories_4.jpg',
      'Urban_territories_5.jpg',
      'Urban_territories_6.jpg',
      'Urban_territories_7.jpg',
      'Urban_territories_8.jpg',
      'Urban_territories_9.jpg',
      'Urban_territories_10.jpg',
      'Urban_territories_11.jpg',
      'Urban_territories_12.jpg',
      'Urban_territories_13.jpg',
      'Urban_territories_14.jpg'
    ]
  },
  borders: {
    slug: 'borders',
    title: 'Borders',
    year: 2018,
    technique: 'Photography',
    base: '/works/works1/Borders',
    files: [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg'
    ]
  },
  'about-india': {
    slug: 'about-india',
    title: 'About India',
    year: 2021,
    technique: 'Photography',
    base: '/works/works1/About India',
    files: [
      '00.jpg',
      '08.jpg',
      'About india 1.JPG',
      'About india 2.JPG',
      'About india 3.jpg',
      'About india 4.jpg',
      'About india 5.JPG',
      'About india 6.jpg',
      'About india 7.jpg',
      'About india 8.JPG',
      'About india 9.JPG',
      'About india 10.JPG',
      'About india 11.JPG'
    ]
  },
  'uncertain-nature-book': {
    slug: 'uncertain-nature',
    title: 'Uncertain Nature Book',
    year: 2022,
    technique: 'Artist book',
    base: '/works/works1/book UNCERTAIN NATURE ',
    files: [
      '01.jpg',
      '2.JPG',
      '3.JPG',
      '4.JPG',
      '5.JPG',
      '6.JPG',
      '7.JPG',
      '8.JPG',
      '9.JPG',
      '10.JPG',
      '11.JPG',
      '12.JPG',
      '13.JPG'
    ]
  }
};

const makeWorkSlides = project => project.files.map((file, index) => makeSlide({
  slug: project.slug,
  title: `${project.title} ${String(index + 1).padStart(2, '0')}`,
  series: project.title,
  year: project.year,
  technique: project.technique,
  file: `${project.base}/${file}`
}, index));

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

export const projectAssets = Object.fromEntries(
  Object.entries(workFiles).map(([slug, project]) => [slug, makeWorkSlides(project)])
);

export const projectGridAssets = Object.fromEntries(
  Object.entries(projectAssets).map(([slug, slides]) => [slug, slides.map((slide, index) => ({ ...slide, slideIndex: index }))])
);

const fallbackSlide = ({ slug, title, series = title, year, file }, index = 0) => makeSlide({
  slug,
  title,
  series,
  year,
  technique: 'Exhibition view',
  file
}, index);

export const workIndexItems = [
  { slug: 'unfixed-landscapes', title: 'Unfixed Landscapes', year: 2026, imageUrl: projectAssets['unfixed-landscapes'][0].imageUrl },
  { slug: 'the-rock-cycle', title: 'The Rock Cycle', year: 2024, imageUrl: projectAssets['the-rock-cycle'][0].imageUrl },
  { slug: 'unearth', title: 'Unearth / ongoing', year: 2026, imageUrl: projectAssets.unearth[0].imageUrl },
  { slug: 'landscape-on-landscape', title: 'Landscape on Landscape', year: 2025, imageUrl: projectAssets['landscape-on-landscape'][0].imageUrl },
  { slug: 'kutho', title: 'Kutho', year: 2021, imageUrl: projectAssets.kutho[0].imageUrl },
  { slug: 'brief-shape', title: 'Brief Shape', year: 2023, imageUrl: projectAssets['brief-shape'][0].imageUrl },
  { slug: 'urban-territories', title: 'Urban Territories', year: 2018, imageUrl: projectAssets['urban-territories'][0].imageUrl },
  { slug: 'borders', title: 'Borders', year: 2018, imageUrl: projectAssets.borders[0].imageUrl },
  { slug: 'about-india', title: 'About India', year: 2021, imageUrl: projectAssets['about-india'][0].imageUrl },
  { slug: 'uncertain-nature-book', title: 'Uncertain Nature Book', year: 2022, imageUrl: projectAssets['uncertain-nature-book'][0].imageUrl }
];

export const exhibitionProjects = [
  {
    slug: 'recoleta-cultural-center',
    title: 'Recoleta Cultural Center',
    year: 2023,
    imageUrl: asset('/exhibitions/portada/recoleta.png'),
    intro: 'An exhibition record of works installed in relation to architecture, distance and public movement. The images trace how each piece changes when it meets the scale and rhythm of the room. Walls, passages and viewing angles become part of the work, shaping the way materials are approached. The documentation preserves that encounter between object, space and viewer.'
  },
  {
    slug: 'espacio-dar-tucuman',
    title: 'Espacio DAR / Tucuman',
    year: 2025,
    imageUrl: asset('/exhibitions/portada/dar.png'),
    intro: 'A site-responsive presentation where layers of landscape, drawing and installation unfold through the passage of the space. The documentation follows the works as they appear from different thresholds, shifting with distance, light and movement. Each view reveals another relation between surface and architecture, turning the exhibition into a sequence of visual pauses.'
  },
  {
    slug: 'park-pecno-slovenia',
    title: 'Park Pecno Slovenia',
    year: 2024,
    imageUrl: asset('/exhibitions/portada/park.png'),
    intro: 'A dialogue between sculptural fragments and the surrounding park. The project places material memory outdoors, allowing stone, textile and landscape to share the same changing light. The open setting gives the works a different temporality, exposed to weather, vegetation and passage. Documentation becomes a way of following how the pieces settle into a living environment.'
  },
  {
    slug: 'museo-bellas-artes-frankling-rawson',
    title: 'Museo Bellas Artes Frankling Rawson',
    year: 2018,
    imageUrl: asset('/exhibitions/portada/frankkin rawson.png'),
    intro: 'Museum views that bring the works into a broader conversation with territory and archive. The installation emphasizes quiet transitions between image, material and institutional space. Within the museum, the pieces hold a measured distance from the viewer while still carrying traces of landscape and body. The record focuses on that balance between containment and expansion.'
  },
  {
    slug: 'oda-arte-art-fairs',
    title: 'OdA Arte. Art FAirs',
    year: 2021,
    imageUrl: asset('/exhibitions/portada/odaarte.png'),
    intro: 'A compact fair presentation focused on encounters between works, viewers and temporary architecture. The images preserve the intensity of a brief display without losing its material detail. In this context, each piece has to speak quickly while still holding its own silence. The documentation follows that compressed rhythm, where proximity and circulation shape the reading of the work.'
  },
  {
    slug: 'mundo-nuevo-gallery-art',
    title: 'Mundo Nuevo Gallery Art',
    year: 2019,
    imageUrl: asset('/exhibitions/portada/mundo nuevo.png'),
    intro: 'Gallery documentation shaped by proximity and sequence. The installation frames the works as a visual conversation, where surface, gesture and scale move from one piece to the next. The space allows details to unfold gradually, creating a close relation between image and material presence. Each photograph keeps a trace of that dialogue and the atmosphere around it.'
  },
  {
    slug: 'centro-cultural-mapocho-chile',
    title: 'Centro Cultural Mapocho CHILE',
    year: 2018,
    imageUrl: asset('/exhibitions/portada/chile.png'),
    intro: 'A cultural center presentation where the works occupy a large architectural setting. The record follows the tension between fragile images and the strong presence of the surrounding space. Scale becomes central: the pieces appear both delicate and insistent within the architecture. The documentation captures how the work changes when viewed across distance and through movement.'
  },
  {
    slug: 'mundo-nuevo-kutho-group-show',
    title: 'Mundo Nuevo/ Kutho/Group show',
    year: 2020,
    imageUrl: asset('/exhibitions/portada/kutho.png'),
    intro: 'A group-show context for Kutho, bringing its material language into dialogue with other practices. The installation highlights how each work carries its own terrain into a shared space. In relation to the surrounding pieces, Kutho keeps its attention on texture, memory and place. The documentation shows that exchange without dissolving the project’s quiet internal rhythm.'
  }
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
