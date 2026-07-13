import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function Statement() {
  const content = useSiteContent('statement');
  return (
    <div className="site-page statement-page">
      <Header />
      <main className="statement-main">
        <section className="statement-layout" aria-labelledby="statement-title">
          <figure className="statement-image reveal">
            <img src={content.imageUrl} alt={content.imageAlt} />
          </figure>

          <div className="statement-content reveal-delay">
            <article className="statement-section">
              <h1 id="statement-title">{content.title}</h1>
              {content.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </article>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
