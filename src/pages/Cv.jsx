import { Footer, Header } from '../components/SiteChrome';
import { normalizeCvItem, safeCvHref } from '../cvItems';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function Cv() {
  const content = useSiteContent('cv');
  const { t } = useLanguage();

  return (
    <div className="site-page cv-page">
      <Header />
      <main className="cv-main">
        <section className="cv-hero" aria-label={t('biography')}>
          <figure className="cv-portrait reveal">
            <img src={content.imageUrl} alt={content.imageAlt} />
          </figure>
          <div className="cv-intro reveal-delay">
            <h4>{content.introLabel}</h4>
            <p>{content.intro}</p>
          </div>
        </section>

        <section className="cv-sections" aria-label={t('biographyDetails')}>
          {content.sections.map(section => (
            <article className="cv-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, index) => {
                  const entry = normalizeCvItem(item);
                  const itemLink = safeCvHref(entry.href);
                  return (
                    <li key={`${section.title}-${index}`}>
                      {itemLink ? (
                        <a href={itemLink} target="_blank" rel="noopener noreferrer">
                          <span>{entry.title}</span><span className="cv-external-mark" aria-hidden="true">↗</span>
                        </a>
                      ) : entry.title}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
