import { Footer, Header } from '../components/SiteChrome';
import { normalizeCvItem, safeCvHref } from '../cvItems';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function Cv() {
  const content = useSiteContent('cv');
  const { t } = useLanguage();
  const honors = content.sections.find(section => /honors|premios|distinciones/i.test(section.title));
  const remainingSections = content.sections.filter(section => section !== honors);
  const leftSections = remainingSections.filter((_, index) => index % 2 === 0);
  const rightSections = remainingSections.filter((_, index) => index % 2 === 1);

  const renderItems = section => (
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
  );

  const renderSection = (section, flowOrder, className = '') => (
    <article
      className={`cv-section ${className}`.trim()}
      key={section.title}
      style={{ '--cv-flow-order': flowOrder }}
    >
      <h2>{section.title}</h2>
      {renderItems(section)}
    </article>
  );

  return (
    <div className="site-page cv-page">
      <Header />
      <main className="cv-main">
        <section className="cv-masonry-grid" aria-label={t('biographyDetails')}>
          <div className="cv-masonry-column">
            <div className="cv-profile reveal" style={{ '--cv-flow-order': 0 }} aria-label={t('biography')}>
              <figure className="cv-portrait">
                <img src={content.imageUrl} alt={content.imageAlt} />
              </figure>
              <div className="cv-intro">
                <p>{content.intro}</p>
              </div>
            </div>
            {leftSections.map((section, index) => renderSection(section, (index * 2) + 2))}
          </div>

          <div className="cv-masonry-column">
            {honors && renderSection(honors, 1, 'cv-honors reveal-delay')}
            {rightSections.map((section, index) => renderSection(section, (index * 2) + 3))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
