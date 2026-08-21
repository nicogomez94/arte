import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function Workshops() {
  const content = useSiteContent('workshops');

  return (
    <div className="site-page workshops-page">
      <Header />
      <main className="workshops-main">
        <h1 className="visually-hidden">{content.title} · Andrea Alkalay</h1>
        <div className="workshops-list">
          {content.rows.map((row, index) => (
            <article className="workshop-row" key={`${row.title}-${index}`}>
              <figure>
                <img src={row.imageUrl} alt={row.imageAlt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
              </figure>
              <div className="workshop-copy">
                <h2>{row.title}</h2>
                <p>{row.text}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
