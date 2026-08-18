import { useState } from 'react';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

const normalizeContactHref = url => {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  if (value.includes('@')) return `mailto:${value}`;
  return value;
};

const getEmailAddress = link => {
  const url = String(link?.url || '').trim();
  const emailFromUrl = url.replace(/^mailto:/i, '').split('?')[0];
  const value = emailFromUrl || String(link?.value || '').trim();
  return value.includes('@') ? value : '';
};

export default function Contact() {
  const content = useSiteContent('contact');
  const { t } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyEmail = async (email, index) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(current => current === index ? null : current), 1800);
    } catch {
      setCopiedIndex(null);
    }
  };

  return (
    <div className="site-page contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero">
          <figure className="contact-portrait reveal">
            <img src={content.imageUrl} alt={content.imageAlt} />
          </figure>
          <div className="contact-content reveal-delay">
            <div className="contact-heading">
              {/* <span className="eyebrow">Contact</span> */}
              <h4>{content.title}</h4>
              <p>{content.subtitle}</p>
            </div>
            <div className="contact-directory">
              {content.links.map((link, index) => (
                getEmailAddress(link) ? (
                  <button
                    className={`contact-link ${copiedIndex === index ? 'is-copied' : ''}`}
                    type="button"
                    key={index}
                    onClick={() => copyEmail(getEmailAddress(link), index)}
                    aria-label={copiedIndex === index ? `${link.value}. ${t('emailCopied')}` : `${t('copyEmail')}: ${link.value}`}
                  >
                    <span>{link.label}</span><strong>{link.value}</strong>
                    <b className="contact-link-status" aria-hidden="true">{copiedIndex === index ? <><span>{t('emailCopied')}</span> ✓</> : '↗'}</b>
                  </button>
                ) : (
                  <a
                    className="contact-link"
                    href={normalizeContactHref(link.url)}
                    key={index}
                    target={String(link.url || '').startsWith('http') ? '_blank' : undefined}
                    rel={String(link.url || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span>{link.label}</span><strong>{link.value}</strong><b aria-hidden="true">↗</b>
                  </a>
                )
              ))}
              <span className="visually-hidden" role="status" aria-live="polite">{copiedIndex !== null ? t('emailCopied') : ''}</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
