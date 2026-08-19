import { Footer, Header } from '../components/SiteChrome';
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

const getGmailComposeHref = email => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

export default function Contact() {
  const content = useSiteContent('contact');

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
                  <a
                    className="contact-link"
                    href={getGmailComposeHref(getEmailAddress(link))}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                    aria-label={`${link.label}: ${link.value}`}
                  >
                    <span>{link.label}</span><strong>{link.value}</strong>
                    <b aria-hidden="true">↗</b>
                  </a>
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
