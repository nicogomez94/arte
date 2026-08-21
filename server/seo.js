import { exhibitionProjects as defaultExhibitions } from '../src/exhibitionAssets.js';
import { projectAssets, workIndexItems } from '../src/projectAssets.js';
import { projects as workStatements } from '../src/projects.js';

export const SITE_URL = 'https://andrealkalay.com';
const ARTIST_ID = `${SITE_URL}/#andrea-alkalay`;

const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const escapeXml = value => escapeHtml(value).replace(/'/g, '&apos;');

const plainText = value => String(value || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const excerpt = (value, fallback) => {
  const text = plainText(value) || fallback;
  if (text.length <= 158) return text;
  return `${text.slice(0, 155).replace(/\s+\S*$/, '')}…`;
};

const absoluteUrl = value => {
  const url = String(value || '').trim();
  if (!url) return `${SITE_URL}/esta.jpg`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const defaultWork = workIndexItems.map(item => {
  const statement = workStatements.find(project => project.slug === item.slug);
  return { ...item, intro: statement?.intro || '', images: [] };
});

const mergeProjects = (defaults, saved) => {
  const savedBySlug = new Map((Array.isArray(saved) ? saved : []).filter(item => item?.slug).map(item => [item.slug, item]));
  const merged = defaults.map(item => ({ ...item, ...(savedBySlug.get(item.slug) || {}) }));
  const defaultSlugs = new Set(defaults.map(item => item.slug));
  return [...merged, ...(Array.isArray(saved) ? saved.filter(item => item?.slug && !defaultSlugs.has(item.slug)) : [])];
};

export const publicProjects = storedContent => ({
  work: mergeProjects(defaultWork, storedContent?.work?.projects).map(project => ({
    ...project,
    imageUrl: project.imageUrl === projectAssets[project.slug]?.[0]?.imageUrl
      ? workIndexItems.find(item => item.slug === project.slug)?.imageUrl
      : project.imageUrl
  })),
  exhibitions: mergeProjects(defaultExhibitions, storedContent?.exhibitions?.projects).map(project => {
    const sourceProject = defaultExhibitions.find(item => item.slug === project.slug);
    return {
      ...project,
      imageUrl: project.imageUrl === sourceProject?.images?.[0]?.imageUrl
        ? sourceProject.imageUrl
        : project.imageUrl
    };
  })
});

const baseMetadata = (pathname, storedContent = {}) => ({
  title: 'Andrea Alkalay · Visual artist',
  description: 'Andrea Alkalay is an Argentine visual artist working with expanded photography, materiality, landscape and territory.',
  path: pathname === '/' ? '/' : pathname.replace(/\/+$/, ''),
  image: !storedContent.home?.heroImageUrl || storedContent.home.heroImageUrl === '/esta.jpg'
    ? '/optimized/andrea-alkalay-unfixed-landscapes-1600.webp'
    : storedContent.home.heroImageUrl,
  imageAlt: storedContent.home?.heroImageAlt || 'Andrea Alkalay installation at Soulangh Cultural Park',
  type: 'website',
  noIndex: false,
  valid: true,
  entity: null
});

export const seoForPath = (pathname, storedContent = {}) => {
  const { work, exhibitions } = publicProjects(storedContent);
  const seo = baseMetadata(pathname, storedContent);

  if (pathname === '/') return seo;
  if (pathname === '/work') return {
    ...seo,
    title: 'Works · Andrea Alkalay',
    description: 'Selected works by Andrea Alkalay across expanded photography, installation, material research, landscape and territory.'
  };
  if (pathname.startsWith('/work/')) {
    const project = work.find(item => `/work/${item.slug}` === pathname);
    if (!project) return { ...seo, title: 'Page not found · Andrea Alkalay', noIndex: true, valid: false };
    const description = excerpt(`${project.title}. ${project.intro || ''}`, `${project.title}, an artwork series by visual artist Andrea Alkalay.`);
    const image = project.imageUrl || project.images?.[0]?.imageUrl;
    return {
      ...seo,
      title: `${project.title} · Andrea Alkalay`,
      description,
      image,
      imageAlt: project.images?.[0]?.alt || `${project.title} · Andrea Alkalay`,
      type: 'article',
      entity: { '@type': 'VisualArtwork', name: project.title, description, image: absoluteUrl(image), dateCreated: project.year ? String(project.year) : undefined }
    };
  }
  if (pathname === '/exhibitions') return {
    ...seo,
    title: 'Exhibitions · Andrea Alkalay',
    description: 'Solo and group exhibitions by visual artist Andrea Alkalay, with installation views and selected project documentation.'
  };
  if (pathname.startsWith('/exhibitions/')) {
    const project = exhibitions.find(item => `/exhibitions/${item.slug}` === pathname);
    if (!project) return { ...seo, title: 'Page not found · Andrea Alkalay', noIndex: true, valid: false };
    const description = excerpt(`${project.title}. ${project.intro || ''}`, `${project.title}, an exhibition by visual artist Andrea Alkalay.`);
    const image = project.imageUrl || project.images?.[0]?.imageUrl;
    return {
      ...seo,
      title: `${project.title} · Andrea Alkalay`,
      description,
      image,
      imageAlt: project.images?.[0]?.alt || `${project.title} · Andrea Alkalay`,
      type: 'article',
      entity: { '@type': 'CreativeWork', name: project.title, description, image: absoluteUrl(image), dateCreated: project.year ? String(project.year) : undefined }
    };
  }

  const staticPages = {
    '/statement': {
      title: 'Artist statement · Andrea Alkalay',
      description: excerpt(storedContent.statement?.paragraphs?.[0], 'Andrea Alkalay’s artist statement on expanded photography, materiality, landscape, territory and memory.'),
      image: storedContent.statement?.imageUrl || '/contact/Andrea-Alkalay.jpg.avif',
      imageAlt: storedContent.statement?.imageAlt || 'Portrait of Andrea Alkalay',
      type: 'article'
    },
    '/acerca-de-mi': {
      title: 'About · Andrea Alkalay',
      description: 'Biography and artistic practice of Andrea Alkalay, an Argentine visual artist based in Buenos Aires.',
      image: storedContent.about?.portraitImageUrl || '/exhibicion-03.png',
      imageAlt: storedContent.about?.portraitImageAlt || 'Andrea Alkalay artwork in an exhibition space',
      type: 'profile'
    },
    '/contacto': {
      title: 'Contact · Andrea Alkalay',
      description: 'Contact visual artist Andrea Alkalay for exhibitions, collaborations and press inquiries.'
    },
    '/cv': {
      title: 'CV · Andrea Alkalay',
      description: 'Curriculum vitae of Andrea Alkalay: exhibitions, residencies, grants, publications and selected honors.',
      image: storedContent.cv?.imageUrl || '/contact/Andrea-Alkalay.jpg.avif',
      imageAlt: storedContent.cv?.imageAlt || 'Andrea Alkalay',
      type: 'profile'
    },
    '/workshops': {
      title: 'Workshops · Andrea Alkalay',
      description: 'Workshops and educational activities by visual artist Andrea Alkalay.',
      image: storedContent.workshops?.rows?.[0]?.imageUrl || '/contact/Andrea-Alkalay.jpg.avif',
      imageAlt: storedContent.workshops?.rows?.[0]?.imageAlt || 'Andrea Alkalay'
    }
  };
  if (staticPages[pathname]) return { ...seo, ...staticPages[pathname] };
  if (pathname === '/admin') return { ...seo, title: 'Admin · Andrea Alkalay', noIndex: true };
  return { ...seo, title: 'Page not found · Andrea Alkalay', noIndex: true, valid: false };
};

const jsonLdFor = seo => {
  const canonical = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;
  const graph = [
    {
      '@type': 'Person', '@id': ARTIST_ID, name: 'Andrea Alkalay', url: `${SITE_URL}/`, jobTitle: 'Visual artist',
      image: `${SITE_URL}/contact/Andrea-Alkalay.jpg.avif`,
      nationality: { '@type': 'Country', name: 'Argentina' },
      homeLocation: { '@type': 'Place', name: 'Buenos Aires, Argentina' },
      sameAs: ['https://instagram.com/andrealkalay', 'https://www.facebook.com/andrea.alkalay.7', 'https://www.linkedin.com/in/andreaalkalay/'],
      knowsAbout: ['Expanded photography', 'Installation art', 'Materiality', 'Landscape', 'Territory']
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Andrea Alkalay', inLanguage: ['en', 'es'], publisher: { '@id': ARTIST_ID } },
    {
      '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: seo.title, description: seo.description,
      inLanguage: 'en', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': ARTIST_ID },
      ...(seo.entity ? { mainEntity: { '@id': `${canonical}#creative-work` } } : {})
    },
    ...(seo.entity ? [{ ...seo.entity, '@id': `${canonical}#creative-work`, creator: { '@id': ARTIST_ID } }] : [])
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
};

export const renderSeoHead = seo => {
  const canonical = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;
  const image = absoluteUrl(seo.image);
  const robots = seo.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  return `<!--seo:head:start-->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="${escapeHtml(seo.type)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt || seo.title)}" />
    <meta property="og:site_name" content="Andrea Alkalay" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script id="seo-jsonld" type="application/ld+json">${jsonLdFor(seo)}</script>
    <!--seo:head:end-->`;
};

export const injectSeoHead = (html, seo) => html.replace(
  /<!--seo:head:start-->[\s\S]*?<!--seo:head:end-->/,
  renderSeoHead(seo)
);

export const sitemapXml = storedContent => {
  const { work, exhibitions } = publicProjects(storedContent);
  const paths = [
    '/', '/work', ...work.map(project => `/work/${project.slug}`),
    '/exhibitions', ...exhibitions.map(project => `/exhibitions/${project.slug}`),
    '/statement', '/acerca-de-mi', '/contacto', '/cv', '/workshops'
  ];
  const uniquePaths = [...new Set(paths)];
  const urls = uniquePaths.map(path => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
