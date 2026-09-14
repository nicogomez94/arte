import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function News() {
  const content = useSiteContent('news');
  const { language } = useLanguage();

  return (
    <div className="site-page news-page">
      <Header />
      <main className="news-main">
        <div className="visually-hidden" role="heading" aria-level="1">News</div>
        <section className="news-carousel reveal" aria-label="News">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
