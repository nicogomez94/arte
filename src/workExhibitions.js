const associations = {
  'unfixed-landscapes': [
    { label: 'Soulangh Cultural Park / Taiwan', labelEs: 'Soulangh Cultural Park / Taiwán', href: '/exhibitions/unfixed-landscapes-taiwan' }
  ],
  unearth: [
    { label: 'Hafez Gallery / Riyadh', labelEs: 'Galería Hafez / Riad', href: '/exhibitions/hafez-gallery' }
  ],
  'the-rock-cycle': [
    { label: 'Park Pečno / Slovenia', labelEs: 'Park Pečno / Eslovenia', href: '/exhibitions/park-pecno-slovenia' },
    { label: 'Bienal Sur / Buenos Aires', labelEs: 'Bienal Sur / Buenos Aires', href: '/exhibitions/bienal-sur' },
    { label: 'Museo Arte Al Límite / Chile', labelEs: 'Museo Arte Al Límite / Chile', href: '' }
  ],
  'landscape-on-landscape': [
    { label: 'Recoleta Cultural Center', labelEs: 'Centro Cultural Recoleta', href: '/exhibitions/recoleta-cultural-center' },
    { label: 'Espacio DAR', labelEs: 'Espacio DAR', href: '/exhibitions/espacio-dar' },
    { label: 'OdA Arte', labelEs: 'OdA Arte', href: '/exhibitions/oda-arte' },
    { label: 'Art Fairs', labelEs: 'Ferias de arte', href: '/exhibitions/art-fairs' }
  ],
  kutho: [
    { label: 'Museo Larreta / Buenos Aires', labelEs: 'Museo Larreta / Buenos Aires', href: '/exhibitions/museo-larreta' },
    { label: 'Art du Sofitel', labelEs: 'Art du Sofitel', href: '/exhibitions/sofitel-recoleta' },
    { label: 'Art Fairs', labelEs: 'Ferias de arte', href: '/exhibitions/art-fairs' }
  ],
  'urban-territories': [
    { label: 'Museo de Bellas Artes Franklin Rawson', labelEs: 'Museo de Bellas Artes Franklin Rawson', href: '/exhibitions/museo-franklin-rawson' },
    { label: 'Centro Cultural Estación Mapocho', labelEs: 'Centro Cultural Estación Mapocho', href: '/exhibitions/estacion-mapocho-chile' },
    { label: 'Art du Sofitel', labelEs: 'Art du Sofitel', href: '/exhibitions/sofitel-recoleta' },
    { label: 'Galería Mundo Nuevo', labelEs: 'Galería Mundo Nuevo', href: '/exhibitions/mundo-nuevo-gallery' },
    { label: 'The New Gallery', labelEs: 'The New Gallery', href: 'https://thenewgallery.org/Urban-Territories-Andrea-Alkalay' }
  ],
  borders: [
    { label: 'Museo de Bellas Artes Franklin Rawson', labelEs: 'Museo de Bellas Artes Franklin Rawson', href: '/exhibitions/museo-franklin-rawson' },
    { label: 'Centro Cultural Estación Mapocho', labelEs: 'Centro Cultural Estación Mapocho', href: '/exhibitions/estacion-mapocho-chile' },
    { label: 'Art du Sofitel', labelEs: 'Art du Sofitel', href: '/exhibitions/sofitel-recoleta' },
    { label: 'Galería Mundo Nuevo', labelEs: 'Galería Mundo Nuevo', href: '/exhibitions/mundo-nuevo-gallery' },
    { label: 'Centro Cultural San Martín', labelEs: 'Centro Cultural San Martín', href: '' }
  ]
};

export const defaultExhibitionLinksForWork = workSlug => (
  (associations[workSlug] || []).map(item => ({ ...item }))
);

const legacyLink = (item, exhibitionProjects, language) => {
  const project = (exhibitionProjects || []).find(entry => entry.slug === item.slug);
  if (!project) return null;
  return {
    slug: project.slug,
    href: `/exhibitions/${project.slug}`,
    title: language === 'es' ? (project.titleEs || project.title) : project.title
  };
};

export const exhibitionsForWork = (workProject, exhibitionProjects, language = 'en') => {
  const project = typeof workProject === 'string' ? { slug: workProject } : (workProject || {});
  const source = Array.isArray(project.exhibitionLinks)
    ? project.exhibitionLinks
    : defaultExhibitionLinksForWork(project.slug);

  return source.map(item => {
    if (item.slug && !item.label && !item.labelEs && !item.href) {
      return legacyLink(item, exhibitionProjects, language);
    }
    const title = language === 'es'
      ? (item.labelEs || item.label)
      : (item.label || item.labelEs);
    if (!String(title || '').trim()) return null;
    const href = String(item.href || (item.slug ? `/exhibitions/${item.slug}` : '')).trim();
    return {
      ...(item.slug ? { slug: item.slug } : {}),
      href,
      title: String(title).trim()
    };
  }).filter(Boolean);
};
