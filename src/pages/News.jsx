import { Footer, Header } from '../components/SiteChrome';
import { cvItemsToRichText, isCvPublicationsSection, sanitizeCvRichText, stripRepresentationFromPublications } from '../cvItems';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function News() {
  const content = useSiteContent('news');
  const cv = useSiteContent('cv');
  const { language } = useLanguage();
  const publications = (cv.sections || []).find(isCvPublicationsSection);

  return (
    <div className="site-page news-page">
      <Header />
      <main className="news-main">
        <div className="visually-hidden" role="heading" aria-level="1">News</div>
        <section className="news-carousel reveal" aria-label="News">
          <div className="news-layout">
            {publications && (
              <aside className="news-publications" aria-label={publications.title}>
                <p className="news-publications-title" role="heading" aria-level="2">{publications.title}</p>
                <div
                  className="cv-rich-text cv-section-entries"
                  dangerouslySetInnerHTML={{
                    __html: stripRepresentationFromPublications(
                      sanitizeCvRichText(publications.contentHtml || cvItemsToRichText(publications.items))
                    )
                  }}
                />
              </aside>
            )}
            <div className="news-track">
              {(content.items || []).map((item, index) => {
                const caption = language === 'es' ? (item.captionEs || item.caption) : item.caption;
                const image = (
                  <div className="news-media">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt || caption}
                      width={item.width}
                      height={item.height}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                );

                return (
                  <article className="news-entry" key={item.id || item.imageUrl}>
                    <figure>
                      {item.url ? (
                        <a className="news-item-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={caption}>
                          {image}
                          <figcaption><p>{caption}</p></figcaption>
                        </a>
                      ) : <div className="news-item-content">{image}<figcaption><p>{caption}</p></figcaption></div>}
                    </figure>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
