const associations = {
  'unfixed-landscapes': [
    { slug: 'unfixed-landscapes-taiwan' }
  ],
  unearth: [
    { slug: 'hafez-gallery' }
  ],
  'the-rock-cycle': [
    { slug: 'park-pecno-slovenia' },
    { slug: 'bienal-sur' },
    { slug: 'art-fairs' }
  ],
  'landscape-on-landscape': [
    { slug: 'recoleta-cultural-center' },
    { slug: 'espacio-dar' },
    { slug: 'oda-arte' },
    { slug: 'art-fairs' }
  ],
  kutho: [
    { slug: 'museo-larreta' },
    { slug: 'sofitel-recoleta' },
    { slug: 'art-fairs' }
  ],
  'urban-territories': [
    { slug: 'museo-franklin-rawson' },
    { slug: 'estacion-mapocho-chile' },
    { slug: 'sofitel-recoleta' },
    { slug: 'mundo-nuevo-gallery' },
    { href: 'https://thenewgallery.org/Urban-Territories-Andrea-Alkalay', label: 'The New Gallery', labelEs: 'The New Gallery' }
  ],
  borders: [
    { slug: 'palacio-libertad' },
    { slug: 'mundo-nuevo-gallery' }
  ]
};

export const exhibitionsForWork = (workSlug, exhibitionProjects, language = 'en') => (
  (associations[workSlug] || []).map(item => {
    if (item.href) return { ...item, title: language === 'es' ? item.labelEs : item.label };
    const project = (exhibitionProjects || []).find(entry => entry.slug === item.slug);
    return project ? { slug: project.slug, title: project.title } : null;
  }).filter(Boolean)
);
