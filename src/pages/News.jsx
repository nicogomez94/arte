import { useRef } from 'react';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function News() {
  const content = useSiteContent('news');
  const { language } = useLanguage();
  const trackRef = useRef(null);
  const scrollNews = direction => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * .8, 760), behavior: 'smooth' });
  };

  return (
    <div className="site-page news-page">
      <Header />
      <main className="news-main">
        <div className="visually-hidden" role="heading" aria-level="1">News</div>
        <section className="news-carousel reveal" aria-label="News">
          <button className="news-arrow news-arrow-prev" type="button" onClick={() => scrollNews(-1)} aria-label={language === 'es' ? 'Noticias anteriores' : 'Previous news'}>←</button>
          <div className="news-track" ref={trackRef}>
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
          <button className="news-arrow news-arrow-next" type="button" onClick={() => scrollNews(1)} aria-label={language === 'es' ? 'Noticias siguientes' : 'Next news'}>→</button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
