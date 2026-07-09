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
  'Unfixed Landscapes_wounded systems-21.jpg',
  'Unfixed Landscapes_wounded systems-22.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-15 - left.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-15 - right.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-16 - left.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-16 - right.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-18 - left.jpg',
  'split-frames/Unfixed Landscapes_wounded systems-18 - right.jpg'
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
  'Rock Cycle Transitions.jpg'
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
  'unfixed-landscapes': projectAssets['unfixed-landscapes'].map((slide, index) => ({ ...slide, slideIndex: index })),
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
