import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function Workshops() {
  const content = useSiteContent('workshops');

  return (
    <div className="site-page workshops-page">
      <Header />
      <main className="workshops-main">
        <header className="workshops-heading reveal">
          <span>01 — {String(content.rows.length).padStart(2, '0')}</span>
          <h1>{content.title}</h1>
        </header>
        <div className="workshops-list">
          {content.rows.map((row, index) => (
            <article className="workshop-row" key={`${row.title}-${index}`}>
              <figure>
                <img src={row.imageUrl} alt={row.imageAlt} />
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div className="workshop-copy">
                  <h2>{row.title}</h2>
                  <p>{row.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
