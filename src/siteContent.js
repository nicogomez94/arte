import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import cvText from '../texto.md?raw';
import { exhibitionProjects, getExhibitionSlides, projectAssets, projectGridAssets, workIndexItems } from './projectAssets';
import { projects } from './projects';
import { api } from './api';

const cleanLine = line => line
  .replace(/[\u200B-\u200D\uFEFF]/g, '')
  .replace(/\u00A0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const headingLabels = new Map([
  ['art residencies & grants', 'Art Residencies & Grants'],
  ['publications', 'Publications'],
  ['artist book:', 'Artist Book'],
  ['solo exhibitions', 'Solo Exhibitions'],
  ['group exhibitions (selected)', 'Group Exhibitions (selected)'],
  ['honors (selected)', 'Honors (selected)']
]);

const parseCv = () => {
  const lines = cvText.replace(/Taiwan2026/g, 'Taiwan\n2026').split(/\r?\n/).map(cleanLine).filter(Boolean);
  const [intro = '', ...body] = lines;
  const sections = [];
  let current;
  body.forEach(line => {
    const key = line.toLowerCase().replace(/\s+:/g, ':');
    if (headingLabels.has(key)) {
      current = { title: headingLabels.get(key), items: [] };
      sections.push(current);
    } else if (current) current.items.push(line);
  });
  return { intro, sections };
};

const workProjects = workIndexItems.map(item => {
  const project = projects.find(entry => entry.slug === item.slug) || item;
  const images = projectAssets[item.slug]?.length ? projectAssets[item.slug] : [{
    id: `${item.slug}-cover`, title: item.title, series: item.title, year: item.year,
    technique: 'Photography', imageUrl: item.imageUrl, alt: item.title
  }];
  return { ...item, intro: project.intro || '', images, gridImages: projectGridAssets[item.slug] || images.map((image, index) => ({ ...image, slideIndex: index })) };
});

const exhibitions = exhibitionProjects.map(project => ({
  ...project,
  images: getExhibitionSlides(project.slug)
}));

export const defaultSiteContent = {
  global: {
    artistName: 'andrea alkalay',
    artistDiscipline: 'Art Photography',
    workMenuLabel: 'Work',
    exhibitionsMenuLabel: 'Exhibitions',
    statementMenuLabel: 'Statement',
    contactMenuLabel: 'Contact',
    cvMenuLabel: 'CV',
    instagramUrl: 'https://instagram.com/andrealkalay',
    footerText: 'andrea alkalay | 2026',
    startViewingLabel: 'Start viewing',
    expandLabel: 'Expand',
    showLessLabel: 'Show less',
    pauseLabel: 'pause',
    playLabel: 'play',
    closeLabel: 'close x',
    noImagesLabel: 'No images available.'
  },
  home: {
    heroImageUrl: '/exhibicion-01.png',
    heroImageAlt: 'Andrea Alkalay installation at Soulangh Cultural Park',
    heroCaption: 'Unfixed Landscapes · Soulangh Cultural Park, Taiwan · 2026',
    selectedWorkLabel: 'selected work',
    viewWorkLabel: 'View work',
    viewMoreLabel: 'View more'
  },
  work: { projects: workProjects },
  exhibitions: { projects: exhibitions },
  statement: {
    imageUrl: '/contact/Andrea-Alkalay.jpg.avif',
    imageAlt: 'Portrait of Andrea Alkalay',
    title: 'Statement',
    paragraphs: [
      'My practice unfolds at the expanded intersection of photography, materiality and research, approaching landscape and territory as sensitive archives of memory.',
      'I understand landscape not as a fixed view, but as a living system: a surface marked by time, pressure, displacement and care. Through photography, installation and material experimentation, I trace the subtle tensions between natural processes and human intervention.',
      'Images often leave the frame to become folded, suspended or wounded objects. Their physical transformations reveal the instability of what we see and the many layers of memory held within a territory.',
      'My work moves between observation and construction. Fragments of stone, textile, paper and photographic matter form temporary constellations in which erosion and repair coexist. Each gesture asks how an image can carry the evidence of change without becoming a closed document.',
      'I am interested in the material histories embedded in surfaces, and the ways memory is sedimented across time and place. Recent projects examine patterns of human care and neglect, mapping traces of use and abandonment to reveal unexpected continuities and relations between body and landscape.',
      'Rather than offering a complete narrative, I create spaces for pause and attentive looking. The landscape emerges as both evidence and question: an open archive where body, matter and memory remain in continuous transformation.'
    ],
    bioTitle: 'Bio',
    bioParagraphs: [
      'Andrea Alkalay is an Argentine visual artist and industrial designer, graduated from the University of Buenos Aires. Based in Buenos Aires, her practice moves between photography, installation, collage and material research.',
      'Her work has been developed through exhibitions, residencies and grants in Argentina and internationally, exploring landscape and territory as spaces where memory, matter and transformation converge.'
    ]
  },
  about: {
    eyebrow: 'About', nameFirstLine: 'Andrea', nameSecondLine: 'Alkalay',
    role: 'Visual artist · Buenos Aires, Argentina', portraitImageUrl: '/exhibicion-03.png',
    portraitImageAlt: 'Andrea Alkalay artwork in an exhibition space', practiceLabel: 'Practice',
    practiceTitle: 'Landscape as a living archive.',
    practiceParagraphs: ['Her practice moves between photography, material research and installation.', 'Images become objects, spaces and traces of memory.'],
    detailImageUrl: '/exhibicion-01.png', detailImageAlt: 'Andrea Alkalay installation at Soulangh Cultural Park',
    detailCaption: 'Soulangh Cultural Park · Taiwan · 2026', detailLabel: 'Matter & territory',
    detailTitle: 'Photography beyond the frame.',
    facts: [{ label: 'Based', value: 'Buenos Aires, Argentina' }, { label: 'Education', value: 'Industrial Design · UBA' }, { label: 'Media', value: 'Photography · installation · collage' }],
    linkLabel: 'View work'
  },
  contact: {
    imageUrl: '/exhibicion-03.png', imageAlt: 'Andrea Alkalay exhibition detail',
    title: 'Let’s connect.', subtitle: 'Exhibitions, collaborations and press.',
    links: [
      { label: 'Email', value: 'info@andrealkalay.com', url: 'mailto:info@andrealkalay.com' },
      { label: 'Instagram', value: '@andrealkalay', url: 'https://instagram.com/andrealkalay' },
      { label: 'Website', value: 'andrealkalay.com', url: 'https://www.andrealkalay.com/' }
    ]
  },
  cv: {
    imageUrl: '/contact/Andrea-Alkalay.jpg.avif', imageAlt: 'Andrea Alkalay',
    introLabel: 'About Andrea,', ...parseCv()
  }
};

const mergeContent = (defaults, stored) => Object.fromEntries(Object.entries(defaults).map(([key, value]) => [
  key,
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...value, ...(stored?.[key] || {}) }
    : (stored?.[key] ?? value)
]));

const SiteContentContext = createContext(defaultSiteContent);

export function SiteContentProvider({ children }) {
  const [stored, setStored] = useState({});
  useEffect(() => { api.content().then(setStored).catch(() => {}); }, []);
  const value = useMemo(() => mergeContent(defaultSiteContent, stored), [stored]);
  return createElement(SiteContentContext.Provider, { value }, children);
}

export const useSiteContent = section => useContext(SiteContentContext)[section];
