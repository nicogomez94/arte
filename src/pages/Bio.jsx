import { Footer, Header } from '../components/SiteChrome';
import { cvItemsToRichText, plainTextToCvHtml, sanitizeCvRichText } from '../cvItems';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function Bio() {
  const statement = useSiteContent('statement');
  const cv = useSiteContent('cv');
  const { t } = useLanguage();
  const belongsToRecognitionColumn = section => /residenc|grant|beca|honor|award|premio|distinci/i.test(section.title);
  const cvColumns = [
    cv.sections.filter(section => !belongsToRecognitionColumn(section)),
    cv.sections.filter(belongsToRecognitionColumn)
  ];

  const renderSection = section => (
    <article className="bio-cv-section" key={section.title}>
      <p className="bio-section-title" role="heading" aria-level="2">{section.title}</p>
      <div
        className="cv-rich-text cv-section-entries"
        dangerouslySetInnerHTML={{ __html: sanitizeCvRichText(section.contentHtml || cvItemsToRichText(section.items)) }}
      />
    </article>
  );

  return (
    <div className="site-page bio-page">
      <Header />
      <main className="bio-main">
        <section className="bio-overview" id="statement" aria-label="Bio · Andrea Alkalay">
          <figure className="bio-portrait reveal">
            <img src={statement.imageUrl} alt={statement.imageAlt} loading="eager" decoding="async" fetchPriority="high" />
          </figure>
          <div className="bio-copy-column reveal-delay">
            <article className="bio-text-block bio-statement-copy">
              <p className="bio-section-title" role="heading" aria-level="1">{statement.title}</p>
              {statement.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </article>

            <article className="bio-text-block bio-profile">
              <p className="bio-section-title" role="heading" aria-level="2">Bio</p>
              <div
                className="cv-rich-text"
                dangerouslySetInnerHTML={{ __html: sanitizeCvRichText(cv.introHtml || plainTextToCvHtml(cv.intro)) }}
              />
            </article>
          </div>
        </section>

        <section className="bio-cv" id="cv" aria-label={t('biographyDetails')}>
          <div className="bio-cv-grid">
            {cvColumns.map((sections, columnIndex) => (
              <div className="bio-cv-column" key={columnIndex}>
                {sections.map(renderSection)}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
