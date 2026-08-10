import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeContentSections } from '../src/contentMerge.js';
import { translateSiteContent } from '../src/translations.js';

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

test('Spanish translation preserves Contact and CV image URLs', () => {
  const content = {
    global: {},
    home: {},
    work: { projects: [] },
    exhibitions: { projects: [] },
    statement: { paragraphs: [] },
    about: {},
    contact: { imageUrl: '/api/media/contact-uuid', links: [] },
    cv: { imageUrl: '/api/media/cv-uuid', intro: '', sections: [] },
    workshops: { title: 'Workshops', rows: [] }
  };
  const translated = translateSiteContent(content, 'es');
  assert.equal(translated.contact.imageUrl, content.contact.imageUrl);
  assert.equal(translated.cv.imageUrl, content.cv.imageUrl);
});
