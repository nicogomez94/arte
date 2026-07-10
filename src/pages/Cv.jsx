import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function Cv() {
  const content = useSiteContent('cv');

  return (
    <div className="site-page cv-page">
      <Header />
      <main className="cv-main">
        <section className="cv-hero" aria-label="Andrea Alkalay CV">
          <figure className="cv-portrait reveal">
            <img src={content.imageUrl} alt={content.imageAlt} />
          </figure>
          <div className="cv-intro reveal-delay">
            <h4>{content.introLabel}</h4>
            <p>{content.intro}</p>
          </div>
        </section>

        <section className="cv-sections" aria-label="CV details">
          {content.sections.map(section => (
            <article className="cv-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, index) => (
                  <li key={`${section.title}-${index}`}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
