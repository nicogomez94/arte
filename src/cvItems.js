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

const escapeHtml = value => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const normalizedSafeHref = value => {
  const href = String(value || '').trim();
  return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : '';
};

export const plainTextToCvHtml = value => String(value || '')
  .split(/\n\s*\n/)
  .map(paragraph => `<p>${escapeHtml(paragraph.trim()).replaceAll('\n', '<br>')}</p>`)
  .join('');

export const sanitizeCvRichText = value => String(value || '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
  .replace(/<div\b[^>]*>/gi, '<p>')
  .replace(/<\/div\s*>/gi, '</p>')
  .replace(/\s(?:on\w+|style|class|id)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/<a\b([^>]*)>/gi, (_tag, attributes) => {
    const match = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = normalizedSafeHref(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
    return href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` : '<a>';
  })
  .replace(/<(?!\/?(?:p|br|strong|b|em|i|ul|ol|li|a)\b)[^>]*>/gi, '')
  .replace(/<(p|strong|b|em|i|ul|ol|li)\b[^>]*>/gi, '<$1>')
  .replace(/<br\b[^>]*>/gi, '<br>')
  .trim();

export const legacyCvHref = title => {
  const normalized = normalizedTitle(title);
  return legacyCvItemLinks.find(([label]) => normalized.includes(label))?.[1] || '';
};

export const normalizeCvItem = item => {
  if (typeof item === 'string') return { title: item, href: legacyCvHref(item) };
  const title = String(item?.title ?? item?.label ?? item?.value ?? '').trim();
  const normalized = { title, href: String(item?.href ?? item?.url ?? legacyCvHref(title) ?? '').trim() };
  const contentHtml = sanitizeCvRichText(item?.contentHtml);
  return contentHtml ? { ...normalized, contentHtml } : normalized;
};

export const cvItemsToRichText = items => {
  const entries = (items || []).map(normalizeCvItem).map(item => {
    const body = item.contentHtml || escapeHtml(item.title);
    const href = normalizedSafeHref(item.href);
    return `<li>${href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${body}</a>` : body}</li>`;
  });
  return entries.length ? `<ul>${entries.join('')}</ul>` : '';
};

export const normalizeCvSections = sections => (sections || []).map(section => {
  const items = (section.items || []).map(normalizeCvItem);
  const hasRichText = Object.prototype.hasOwnProperty.call(section || {}, 'contentHtml');
  return {
    ...section,
    title: String(section?.title || '').trim(),
    titleEs: String(section?.titleEs || '').trim(),
    contentHtml: sanitizeCvRichText(hasRichText ? section.contentHtml : cvItemsToRichText(items)),
    contentHtmlEs: sanitizeCvRichText(section?.contentHtmlEs),
    items
  };
});

export const safeCvHref = value => {
  return normalizedSafeHref(value);
};
