import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

const SITE_URL = 'https://andrealkalay.com';
const ARTIST_ID = `${SITE_URL}/#andrea-alkalay`;

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

const canonicalPath = pathname => {
  if (pathname === '/galeria') return '/exhibitions';
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
};

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
};

const staticCopy = {
  en: {
    homeTitle: 'Andrea Alkalay · Visual artist',
    homeDescription: 'Andrea Alkalay is an Argentine visual artist working with expanded photography, materiality, landscape and territory.',
    workTitle: 'Works · Andrea Alkalay',
    workDescription: 'Selected works by Andrea Alkalay across expanded photography, installation, material research, landscape and territory.',
    exhibitionsTitle: 'Exhibitions · Andrea Alkalay',
    exhibitionsDescription: 'Solo and group exhibitions by visual artist Andrea Alkalay, with installation views and selected project documentation.',
    statementTitle: 'Artist statement · Andrea Alkalay',
    aboutTitle: 'About · Andrea Alkalay',
    contactTitle: 'Contact · Andrea Alkalay',
    contactDescription: 'Contact visual artist Andrea Alkalay for exhibitions, collaborations and press inquiries.',
    cvTitle: 'CV · Andrea Alkalay',
    cvDescription: 'Curriculum vitae of Andrea Alkalay: exhibitions, residencies, grants, publications and selected honors.',
    workshopsTitle: 'Workshops · Andrea Alkalay',
    workshopsDescription: 'Workshops and educational activities by visual artist Andrea Alkalay.',
    projectSuffix: 'Artwork series',
    exhibitionSuffix: 'Exhibition',
    notFoundTitle: 'Page not found · Andrea Alkalay'
  },
  es: {
    homeTitle: 'Andrea Alkalay · Artista visual',
    homeDescription: 'Andrea Alkalay es una artista visual argentina que trabaja con fotografía expandida, materialidad, paisaje y territorio.',
    workTitle: 'Obra · Andrea Alkalay',
    workDescription: 'Obras seleccionadas de Andrea Alkalay en fotografía expandida, instalación, investigación material, paisaje y territorio.',
    exhibitionsTitle: 'Exhibiciones · Andrea Alkalay',
    exhibitionsDescription: 'Exhibiciones individuales y colectivas de la artista visual Andrea Alkalay, con vistas de montaje y documentación.',
    statementTitle: 'Statement de artista · Andrea Alkalay',
    aboutTitle: 'Acerca de Andrea Alkalay',
    contactTitle: 'Contacto · Andrea Alkalay',
    contactDescription: 'Contacto de la artista visual Andrea Alkalay para exhibiciones, colaboraciones y prensa.',
    cvTitle: 'CV · Andrea Alkalay',
    cvDescription: 'Currículum de Andrea Alkalay: exhibiciones, residencias, becas, publicaciones y distinciones seleccionadas.',
    workshopsTitle: 'Talleres · Andrea Alkalay',
    workshopsDescription: 'Talleres y actividades educativas de la artista visual Andrea Alkalay.',
    projectSuffix: 'Serie artística',
    exhibitionSuffix: 'Exhibición',
    notFoundTitle: 'Página no encontrada · Andrea Alkalay'
  }
};

export default function Seo() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const global = useSiteContent('global');
  const home = useSiteContent('home');
  const { projects: workProjects } = useSiteContent('work');
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const statement = useSiteContent('statement');
  const about = useSiteContent('about');
  const cv = useSiteContent('cv');
  const workshops = useSiteContent('workshops');
  const copy = staticCopy[language] || staticCopy.en;

  const seo = useMemo(() => {
    const fallbackDescription = copy.homeDescription;
    const base = {
      title: copy.homeTitle,
      description: fallbackDescription,
      path: canonicalPath(pathname),
      image: home.heroImageUrl === '/esta.jpg'
        ? '/optimized/andrea-alkalay-unfixed-landscapes-1600.webp'
        : home.heroImageUrl,
      imageAlt: home.heroImageAlt,
      type: 'website',
      noIndex: pathname === '/admin',
      entity: null
    };

    if (pathname === '/') return base;
    if (pathname === '/work') return { ...base, title: copy.workTitle, description: copy.workDescription };
    if (pathname.startsWith('/work/')) {
      const project = workProjects.find(item => `/work/${item.slug}` === pathname);
      if (!project) return { ...base, title: copy.notFoundTitle, noIndex: true };
      const description = excerpt(`${project.title}. ${project.intro || ''}`, `${project.title}. ${copy.workDescription}`);
      const image = project.imageUrl || project.images?.[0]?.imageUrl;
      return {
        ...base,
        title: `${project.title} · Andrea Alkalay`,
        description,
        image,
        imageAlt: project.images?.[0]?.alt || `${project.title} · Andrea Alkalay`,
        type: 'article',
        entity: {
          '@type': 'VisualArtwork',
          name: project.title,
          description,
          image: absoluteUrl(image),
          dateCreated: project.year ? String(project.year) : undefined,
          creator: { '@id': ARTIST_ID }
        }
      };
    }
    if (pathname === '/exhibitions' || pathname === '/galeria') {
      return { ...base, title: copy.exhibitionsTitle, description: copy.exhibitionsDescription, path: '/exhibitions' };
    }
    if (pathname.startsWith('/exhibitions/')) {
      const project = exhibitionProjects.find(item => `/exhibitions/${item.slug}` === pathname);
      if (!project) return { ...base, title: copy.notFoundTitle, noIndex: true };
      const description = excerpt(`${project.title}. ${project.intro || ''}`, `${project.title}. ${copy.exhibitionsDescription}`);
      const image = project.imageUrl || project.images?.[0]?.imageUrl;
      return {
        ...base,
        title: `${project.title} · Andrea Alkalay`,
        description,
        image,
        imageAlt: project.images?.[0]?.alt || `${project.title} · Andrea Alkalay`,
        type: 'article',
        entity: {
          '@type': 'CreativeWork',
          name: project.title,
          description,
          image: absoluteUrl(image),
          dateCreated: project.year ? String(project.year) : undefined,
          creator: { '@id': ARTIST_ID }
        }
      };
    }
    if (pathname === '/statement') return {
      ...base,
      title: copy.statementTitle,
      description: excerpt(statement.paragraphs?.[0], fallbackDescription),
      image: statement.imageUrl,
      imageAlt: statement.imageAlt,
      type: 'article'
    };
    if (pathname === '/acerca-de-mi') return {
      ...base,
      title: copy.aboutTitle,
      description: excerpt(`${about.role}. ${about.practiceTitle} ${about.practiceParagraphs?.join(' ')}`, fallbackDescription),
      image: about.portraitImageUrl,
      imageAlt: about.portraitImageAlt,
      type: 'profile'
    };
    if (pathname === '/contacto') return { ...base, title: copy.contactTitle, description: copy.contactDescription };
    if (pathname === '/cv') return {
      ...base,
      title: copy.cvTitle,
      description: copy.cvDescription,
      image: cv.imageUrl,
      imageAlt: cv.imageAlt,
      type: 'profile'
    };
    if (pathname === '/workshops') return {
      ...base,
      title: copy.workshopsTitle,
      description: copy.workshopsDescription,
      image: workshops.rows?.[0]?.imageUrl,
      imageAlt: workshops.rows?.[0]?.imageAlt
    };
    if (pathname === '/admin') return { ...base, title: 'Admin · Andrea Alkalay', noIndex: true };
    return { ...base, title: copy.notFoundTitle, noIndex: true };
  }, [about, copy, cv, exhibitionProjects, home, pathname, statement, workProjects, workshops]);

  useEffect(() => {
    const canonical = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;
    const image = absoluteUrl(seo.image);
    document.title = seo.title;
    document.documentElement.lang = language;

    setMeta('meta[name="description"]', { name: 'description', content: seo.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: seo.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: seo.imageAlt || seo.title });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Andrea Alkalay' });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: language === 'es' ? 'es_AR' : 'en_US' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const graph = [
      {
        '@type': 'Person',
        '@id': ARTIST_ID,
        name: 'Andrea Alkalay',
        url: SITE_URL,
        jobTitle: language === 'es' ? 'Artista visual' : 'Visual artist',
        image: `${SITE_URL}/contact/Andrea-Alkalay.jpg.avif`,
        nationality: { '@type': 'Country', name: 'Argentina' },
        homeLocation: { '@type': 'Place', name: 'Buenos Aires, Argentina' },
        sameAs: [global.instagramUrl, global.facebookUrl, global.linkedinUrl].filter(Boolean),
        knowsAbout: ['Expanded photography', 'Installation art', 'Materiality', 'Landscape', 'Territory']
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Andrea Alkalay',
        inLanguage: ['en', 'es'],
        publisher: { '@id': ARTIST_ID }
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        inLanguage: language,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': ARTIST_ID },
        ...(seo.entity ? { mainEntity: { '@id': `${canonical}#creative-work` } } : {})
      },
      ...(seo.entity ? [{ ...seo.entity, '@id': `${canonical}#creative-work` }] : [])
    ];

    let script = document.head.querySelector('#seo-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [global, language, seo]);

  return null;
}
