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

test('Spanish translation uses the editable Exhibition title', () => {
  const content = {
    global: {},
    home: {},
    work: { projects: [] },
    exhibitions: {
      projects: [{
        slug: 'art-fairs',
        title: 'Art Fairs',
        titleEs: 'Ferias de arte',
        intro: '',
        images: [
          { title: 'Art Fairs 01', titleEs: 'Ferias de arte 01' },
          { title: 'Art Fairs 02', titleEs: '   ' }
        ]
      }]
    },
    statement: { paragraphs: [] },
    about: {},
    contact: { links: [] },
    cv: { intro: '', sections: [] },
    workshops: { title: 'Workshops', rows: [] }
  };

  const translated = translateSiteContent(content, 'es');
  assert.equal(translated.exhibitions.projects[0].title, 'Ferias de arte');
  assert.equal(translated.exhibitions.projects[0].images[0].title, 'Ferias de arte 01');
  assert.equal(translated.exhibitions.projects[0].images[1].title, '');
});

test('Spanish translation uses the editable Work title', () => {
  const content = {
    global: {},
    home: {},
    work: {
      projects: [{
        slug: 'the-rock-cycle',
        title: 'The Rock Cycle',
        titleEs: 'Ciclo geológico editable',
        intro: '',
        images: []
      }]
    },
    exhibitions: { projects: [] },
    statement: { paragraphs: [] },
    about: {},
    contact: { links: [] },
    cv: { intro: '', sections: [] },
    workshops: { title: 'Workshops', rows: [] }
  };

  const translated = translateSiteContent(content, 'es');
  assert.equal(translated.work.projects[0].title, 'Ciclo geológico editable');
});

test('CV rich-text translation changes visible copy without touching link destinations', () => {
  const html = '<ul><li><a href="https://example.com/Page">Photography magazine interview</a></li></ul>';
  assert.equal(
    translateCvRichText(html),
    '<ul><li><a href="https://example.com/Page">revista de fotografía entrevista</a></li></ul>'
  );
});
