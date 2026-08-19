import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import cvText from '../texto.md?raw';
import { projectAssets, workIndexItems } from './projectAssets';
import { exhibitionProjects } from './exhibitionAssets';
import { projects } from './projects';
import { api } from './api';
import { useLanguage } from './i18n';
import { exhibitionStatementsEs, workStatementsEs } from './spanishStatements';
import { statementParagraphsEs, translateSiteContent } from './translations';
import { normalizeProjectMedia } from './mediaContent';
import { normalizeCvItem, normalizeCvSections } from './cvItems';
import { mergeContentSections, normalizeStoredContent } from './contentMerge';
import { DEFAULT_NAVIGATION_ORDER, normalizeNavigationOrder } from './navigation';

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
    } else if (current) current.items.push(normalizeCvItem(line));
  });
  return {
    intro,
    sections: sections.filter(section => !section.title.toLowerCase().startsWith('group exhibitions'))
  };
};

const workProjects = workIndexItems.map(item => {
  const project = projects.find(entry => entry.slug === item.slug) || item;
  const images = projectAssets[item.slug]?.length ? projectAssets[item.slug] : [{
    id: `${item.slug}-cover`, title: item.title, series: item.title, year: item.year,
    technique: 'Photography', imageUrl: item.imageUrl, alt: item.title
  }];
  return {
    ...item,
    intro: project.intro || '',
    introEs: workStatementsEs[item.slug] || '',
    statementVersion: 1,
    images
  };
});

const exhibitions = exhibitionProjects.map(project => ({
  ...project,
  introEs: exhibitionStatementsEs[project.slug] || '',
  statementVersion: 1
}));

const parsedCvContent = parseCv();
const workshopIntroEs = 'Artista visual y diseñadora industrial argentina, graduada de la Universidad de Buenos Aires. Su práctica se desarrolla en la intersección expandida de la fotografía, la materialidad y la investigación, y aborda el paisaje y el territorio como archivos sensibles de la memoria.';
const cvIntroEs = workshopIntroEs;
const workshopRows = Array.from({ length: 4 }, (_, index) => ({
  title: `Workshop ${String(index + 1).padStart(2, '0')}`,
  titleEs: `Taller ${String(index + 1).padStart(2, '0')}`,
  imageUrl: '/contact/Andrea-Alkalay.jpg.avif',
  imageAlt: 'Andrea Alkalay',
  imageAltEs: 'Andrea Alkalay',
  text: parsedCvContent.intro,
  textEs: workshopIntroEs
}));

export const defaultSiteContent = {
  global: {
    menuLabelsVersion: 2,
    menuOrder: [...DEFAULT_NAVIGATION_ORDER],
    artistName: 'andrea alkalay',
    artistDiscipline: 'Art Photography',
    workMenuLabel: 'Work',
    exhibitionsMenuLabel: 'Exhibitions',
    statementMenuLabel: 'Statement',
    contactMenuLabel: 'Contact',
    cvMenuLabel: 'CV',
    workshopsMenuLabel: 'Workshops',
    workMenuLabelEs: 'Obra',
    exhibitionsMenuLabelEs: 'Exhibiciones',
    statementMenuLabelEs: 'Statement',
    contactMenuLabelEs: 'Contacto',
    cvMenuLabelEs: 'CV',
    workshopsMenuLabelEs: 'Talleres',
    instagramUrl: 'https://instagram.com/andrealkalay',
    facebookUrl: 'https://www.facebook.com/andrea.alkalay.7',
    linkedinUrl: 'https://www.linkedin.com/in/andreaalkalay/',
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
    heroImageUrl: '/esta.jpg',
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
    paragraphsEs: [...statementParagraphsEs]
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
    contentVersion: 1,
    imageUrl: '/exhibicion-03.png', imageAlt: 'Andrea Alkalay exhibition detail',
    title: 'Let’s connect.', subtitle: 'Exhibitions, collaborations and press.',
    links: [
      { label: 'Email', value: 'info@andrealkalay.com', url: 'mailto:info@andrealkalay.com' },
      { label: 'Instagram', value: '@andrealkalay', url: 'https://instagram.com/andrealkalay' },
      { label: 'LinkedIn', value: 'linkedin.com/in/andreaalkalay', url: 'https://www.linkedin.com/in/andreaalkalay/' },
      { label: 'Facebook', value: 'facebook.com/andrea.alkalay.7', url: 'https://www.facebook.com/andrea.alkalay.7' }
    ]
  },
  cv: {
    imageUrl: '/contact/Andrea-Alkalay.jpg.avif', imageAlt: 'Andrea Alkalay',
    introLabel: '',
    introHtml: '',
    introHtmlEs: '',
    introEs: cvIntroEs,
    ...parsedCvContent
  },
  workshops: {
    title: 'Workshops',
    titleEs: 'Talleres',
    rows: workshopRows
  }
};

export const mergeSiteContent = (stored = {}) => {
  const normalizedStored = normalizeStoredContent(stored);
  const merged = mergeContentSections(defaultSiteContent, normalizedStored);
  if (Number(normalizedStored.global?.menuLabelsVersion || 0) < 1) {
    merged.global = {
      ...merged.global,
      menuLabelsVersion: 1,
      cvMenuLabel: 'CV',
      cvMenuLabelEs: 'CV',
      workshopsMenuLabel: 'Workshops',
      workshopsMenuLabelEs: 'Talleres'
    };
  }
  if (Number(normalizedStored.global?.menuLabelsVersion || 0) < 2) {
    merged.global = {
      ...merged.global,
      menuLabelsVersion: 2,
      exhibitionsMenuLabelEs: 'Exhibiciones'
    };
  }
  merged.global.menuOrder = normalizeNavigationOrder(merged.global.menuOrder);
  merged.contact.links = (merged.contact.links || []).filter(link => link.url !== 'https://www.andrealkalay.com/');
  if (Number(normalizedStored.contact?.contentVersion || 0) < 1) {
    defaultSiteContent.contact.links.slice(-2).forEach(socialLink => {
      if (!merged.contact.links.some(link => link.label?.trim().toLowerCase() === socialLink.label.toLowerCase())) {
        merged.contact.links.push(socialLink);
      }
    });
  }
  delete merged.cv.links;
  merged.cv.sections = normalizeCvSections((merged.cv.sections || []).filter(section => (
    !section.title?.trim().toLowerCase().startsWith('group exhibitions')
  )));
  // Bio used to live inside Statement. Strip legacy saved fields as well so it
  // disappears from both the public page and the content editor.
  if (merged.statement) {
    const { bioTitle: _bioTitle, bioParagraphs: _bioParagraphs, ...statement } = merged.statement;
    merged.statement = statement;
  }
  // Content saved before exhibitions were split into Solo and Group shows is
  // replaced once with the new folder-driven archive. Subsequent admin edits
  // already include `category` and continue to take precedence.
  if (normalizedStored.exhibitions?.projects?.length && !normalizedStored.exhibitions.projects.some(project => project.category)) {
    merged.exhibitions = defaultSiteContent.exhibitions;
  }
  // Older saved Work content pointed at the previous `/unfixed` and
  // `/rockcycle` image sets. Prefer the new folder-driven archive once.
  if (normalizedStored.work?.projects?.length && !normalizedStored.work.projects.some(project => (
    project.imageUrl?.startsWith('/works/') ||
    project.images?.some(image => image.imageUrl?.startsWith('/works/'))
  ))) {
    merged.work = defaultSiteContent.work;
  }
  // Statements kept beside each Work image archive are the canonical public
  // project texts. Seed both languages once, then preserve all admin edits.
  merged.work.projects = (merged.work.projects || []).map(project => {
    const isRemovedProjectMedia = item => (
      project.slug === 'uncertain-nature-book' && (
        item.mediaType === 'video' ||
        /\.(?:m4v|mov|mp4|webm)$/i.test(item.imageUrl || '')
      )
    ) || (
      project.slug === 'about-india' &&
      /\/(?:00|08)\.jpg$/i.test(item.imageUrl || '')
    );
    project = normalizeProjectMedia({
      ...project,
      imageUrl: isRemovedProjectMedia({ imageUrl: project.imageUrl })
        ? (projectAssets[project.slug]?.[0]?.imageUrl || '')
        : project.imageUrl,
      images: (Array.isArray(project.images) ? project.images : project.gridImages || []).filter(item => !isRemovedProjectMedia(item))
    });
    const sourceProject = projects.find(item => item.slug === project.slug);
    const savedProject = normalizedStored.work?.projects?.find(item => item.slug === project.slug);
    const statementsWereSeeded = Number(savedProject?.statementVersion || 0) >= 1;
    const intro = statementsWereSeeded && typeof project.intro === 'string'
      ? project.intro
      : (sourceProject?.intro ?? project.intro ?? '');
    const introEs = statementsWereSeeded && typeof project.introEs === 'string'
      ? project.introEs
      : (workStatementsEs[project.slug] || '');
    const canonicalVideos = (projectAssets[project.slug] || []).filter(item => (
      item.mediaType === 'video' || item.mediaType === 'youtube'
    ));
    if (!canonicalVideos.length) {
      return { ...project, intro, introEs, statementVersion: 1 };
    }

    const isObsoleteUncertainVideo = item => item.imageUrl?.endsWith('/IMG_3675.m4v');
    const currentImages = (project.images || []).filter(item => !isObsoleteUncertainVideo(item));
    const currentImageUrls = new Set(currentImages.map(item => item.imageUrl));
    const images = [...currentImages, ...canonicalVideos.filter(item => !currentImageUrls.has(item.imageUrl))];
    return {
      ...project,
      intro,
      introEs,
      statementVersion: 1,
      images
    };
  });
  merged.exhibitions.projects = (merged.exhibitions.projects || []).map(project => {
    const sourceProject = exhibitions.find(item => item.slug === project.slug);
    const projectImages = Array.isArray(project.images) ? project.images : (project.gridImages || []);
    const images = projectImages.map((image, index) => {
      const sourceImage = sourceProject?.images?.find(item => (
        item.id === image.id || item.imageUrl === image.imageUrl
      )) || sourceProject?.images?.[index];
      return {
        ...image,
        titleEs: image.titleEs?.trim() || sourceImage?.titleEs || image.title || ''
      };
    });
    return normalizeProjectMedia({
      ...project,
      titleEs: project.titleEs?.trim() || sourceProject?.titleEs || '',
      images,
      intro: typeof project.intro === 'string' ? project.intro : '',
      introEs: typeof project.introEs === 'string'
        ? project.introEs
        : (exhibitionStatementsEs[project.slug] || ''),
      statementVersion: 1
    });
  });
  return merged;
};

const SiteContentContext = createContext(defaultSiteContent);
export const SITE_CONTENT_UPDATED_EVENT = 'site-content-updated';

export function SiteContentProvider({ children }) {
  const [stored, setStored] = useState({});
  const inFlight = useRef(null);
  const abortController = useRef(null);
  const refreshTimer = useRef(null);
  const { language } = useLanguage();

  const refreshContent = useCallback((force = false) => {
    if (inFlight.current && !force) return inFlight.current;
    if (force) {
      abortController.current?.abort();
      inFlight.current = null;
    }
    abortController.current = new AbortController();
    const currentRequest = api.content({ signal: abortController.current.signal })
      .then(setStored)
      .catch(error => {
        if (error.name !== 'AbortError') throw error;
      })
      .finally(() => {
        if (inFlight.current === currentRequest) inFlight.current = null;
      });
    inFlight.current = currentRequest;
    return currentRequest;
  }, []);

  useEffect(() => {
    refreshContent().catch(() => {});
    const scheduleRefresh = () => {
      if (refreshTimer.current !== null) return;
      refreshTimer.current = window.setTimeout(() => {
        refreshTimer.current = null;
        refreshContent(true).catch(() => {});
      }, 50);
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') scheduleRefresh();
    };

    window.addEventListener('focus', scheduleRefresh);
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, scheduleRefresh);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', scheduleRefresh);
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, scheduleRefresh);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
      abortController.current?.abort();
      inFlight.current = null;
    };
  }, [refreshContent]);
  const value = useMemo(
    () => translateSiteContent(mergeSiteContent(stored), language),
    [stored, language]
  );
  return createElement(SiteContentContext.Provider, { value }, children);
}

export const useSiteContent = section => useContext(SiteContentContext)[section];
