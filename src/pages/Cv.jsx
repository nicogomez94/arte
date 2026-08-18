import { Footer, Header } from '../components/SiteChrome';
import { cvItemsToRichText, plainTextToCvHtml, sanitizeCvRichText } from '../cvItems';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function Cv() {
  const content = useSiteContent('cv');
  const { t } = useLanguage();
  const honors = content.sections.find(section => /honors|premios|distinciones/i.test(section.title));
  const remainingSections = content.sections.filter(section => section !== honors);
  const leftSections = remainingSections.filter((_, index) => index % 2 === 0);
  const rightSections = remainingSections.filter((_, index) => index % 2 === 1);

  const renderSection = (section, flowOrder, className = '') => (
    <article
      className={`cv-section ${className}`.trim()}
      key={section.title}
      style={{ '--cv-flow-order': flowOrder }}
    >
      <h2>{section.title}</h2>
      <div
        className="cv-rich-text cv-section-entries"
        dangerouslySetInnerHTML={{ __html: sanitizeCvRichText(section.contentHtml || cvItemsToRichText(section.items)) }}
      />
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
                <div
                  className="cv-rich-text"
                  dangerouslySetInnerHTML={{ __html: sanitizeCvRichText(content.introHtml || plainTextToCvHtml(content.intro)) }}
                />
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
