import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeContentSections, normalizeStoredContent } from '../src/contentMerge.js';
import { translateCvRichText, translateSiteContent } from '../src/translations.js';

test('stored Contact and CV image URLs take precedence over defaults', () => {
  const defaults = {
    contact: { imageUrl: '/default-contact.jpg', title: 'Contact' },
    cv: { imageUrl: '/default-cv.jpg', intro: 'Default' }
  };
  const stored = {
    contact: { imageUrl: '/api/media/contact-uuid' },
    cv: { imageUrl: '/api/media/cv-uuid' }
  };
  const merged = mergeContentSections(defaults, stored);
  assert.equal(merged.contact.imageUrl, stored.contact.imageUrl);
  assert.equal(merged.cv.imageUrl, stored.cv.imageUrl);
});

test('null content responses fall back to an empty stored content object', () => {
  assert.deepEqual(normalizeStoredContent(null), {});
  assert.deepEqual(mergeContentSections({ global: { artistName: 'Andrea' } }, null), {
    global: { artistName: 'Andrea' }
  });
});

test('Spanish translation preserves Contact and CV image URLs', () => {
  const content = {
    global: {},
    home: {},
    work: { projects: [] },
    exhibitions: { projects: [] },
    statement: { paragraphs: [] },
    about: {},
    contact: { imageUrl: '/api/media/contact-uuid', links: [{ label: 'Email', value: 'info@example.com', url: 'mailto:info@example.com' }] },
    cv: { imageUrl: '/api/media/cv-uuid', intro: '', sections: [] },
    workshops: { title: 'Workshops', rows: [] }
  };
  const translated = translateSiteContent(content, 'es');
  assert.equal(translated.contact.imageUrl, content.contact.imageUrl);
  assert.equal(translated.cv.imageUrl, content.cv.imageUrl);
  assert.equal(translated.global.exhibitionsMenuLabel, 'Exhibiciones');
  assert.equal(translated.contact.links[0].label, 'E-mail');
});

test('CV rich-text translation changes visible copy without touching link destinations', () => {
  const html = '<ul><li><a href="https://example.com/Page">Photography magazine interview</a></li></ul>';
  assert.equal(
    translateCvRichText(html),
    '<ul><li><a href="https://example.com/Page">revista de fotografía entrevista</a></li></ul>'
  );
});
