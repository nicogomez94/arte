const legacyCvItemLinks = [
  ['talking pictures', 'https://talking-pictures.online/2025/08/13/andrea-alkalay-sediments-of-time/'],
  ['aal mag', 'https://www.instagram.com/p/DLa_jqEOAir/'],
  ['see-zeen photo mag', 'https://see-zeen.com/andrea-alkalay'],
  ['art amalgama', 'https://www.artamalgama.com/artists-1/andrea-alkalay'],
  ['atrum art', 'https://www.atrumart.com/artists/544'],
  ['f-stop interview', 'https://www.fstopmagazine.com/blog/2023/interview-with-featured-photographer-andrea-alkalay/'],
  ['f-stop entrevista', 'https://www.fstopmagazine.com/blog/2023/interview-with-featured-photographer-andrea-alkalay/'],
  ['lenscratch', 'http://lenscratch.com/2022/06/andrea-alkalay-landscape-on-landscape/'],
  ['aethetica mag', 'https://issuu.com/aesthetica_magazine/docs/aesthetica-issue107?fr=sMWQ3ODQ4NTY2MTM'],
  ['world photography organization', 'https://www.worldphoto.org/blogs/06-08-21/breaking-boundaries-andrea-alkalay'],
  ['phmuseum kutho', 'https://phmuseum.com/galleries/kutho'],
  ['float magazine', 'https://www.floatmagazine.us/portfolios/andrea-alkalay'],
  ['artdoc photography magazine', 'https://www.artdoc.photo/articles/ancient-relationship-between-gold-and-religion'],
  ['artdoc revista de fotografía', 'https://www.artdoc.photo/articles/ancient-relationship-between-gold-and-religion'],
  ['art fluent', 'https://www.art-fluent.com/andrea-alkalay'],
  ['uncertain nature', 'https://issuu.com/andreaalkalay/docs/naturaleza_incierta'],
  ['naturaleza incierta', 'https://issuu.com/andreaalkalay/docs/naturaleza_incierta']
];

const normalizedTitle = value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();

export const legacyCvHref = title => {
  const normalized = normalizedTitle(title);
  return legacyCvItemLinks.find(([label]) => normalized.includes(label))?.[1] || '';
};

export const normalizeCvItem = item => {
  if (typeof item === 'string') return { title: item, href: legacyCvHref(item) };
  const title = String(item?.title ?? item?.label ?? item?.value ?? '').trim();
  return { title, href: String(item?.href ?? item?.url ?? legacyCvHref(title) ?? '').trim() };
};

export const normalizeCvSections = sections => (sections || []).map(section => ({
  ...section,
  items: (section.items || []).map(normalizeCvItem)
}));

export const safeCvHref = value => {
  const href = String(value || '').trim();
  return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : '';
};
