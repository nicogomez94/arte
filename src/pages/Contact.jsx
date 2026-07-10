import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

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
                <a href={link.url} key={index} target={link.url.startsWith('http') ? '_blank' : undefined} rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  <span>{link.label}</span><strong>{link.value}</strong><b>↗</b>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
