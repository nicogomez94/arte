import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Footer, Header, Loading } from '../components/SiteChrome';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="site-page">
      <Header />
      <main>
        <section className="home-hero" aria-label="Andrea Alkalay exhibition">
          <figure className="hero-image reveal">
            <img src="/exhibicion-01.png" alt="Andrea Alkalay installation at Soulangh Cultural Park" />
            <figcaption>Unfixed Landscapes · Soulangh Cultural Park, Taiwan · 2026</figcaption>
          </figure>
        </section>

        <section className="artist-intro" id="artista">
          <figure>
            <img src="/exhibicion-03.png" alt="Andrea Alkalay artwork on exhibition" />
          </figure>
          <div className="artist-copy">
            <span className="eyebrow">The artist</span>
            <h2>Landscape, matter<br />and memory.</h2>
            <p>Andrea Alkalay works across photography, materiality and installation.</p>
            <Link className="text-link" to="/work/unfixed-landscapes">View project <span>↗</span></Link>
          </div>
        </section>

        <section className="portfolio-section" id="portfolio">
          <header className="section-heading">
            <div><span className="eyebrow">Selected archive</span><h2>Work</h2></div>
            <Link to="/work/unfixed-landscapes">View all →</Link>
          </header>
          {loading ? <Loading /> : (
            <div className="art-grid">
              {artworks.slice(0, 4).map((artwork, index) => (
                <article className="art-card" key={artwork.id}>
                  <Link to="/work/unfixed-landscapes" aria-label={`View ${artwork.title} in the gallery`}>
                    <div className="art-image"><img src={artwork.imageUrl} alt={artwork.alt || artwork.title} /></div>
                    <div className="art-meta"><span>{String(index + 1).padStart(2, '0')}</span><h3>{artwork.title}</h3><p>{artwork.series} · {artwork.year}</p></div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="home-contact" id="contacto">
          <span className="eyebrow">Inquiries &amp; collaborations</span>
          <h2>Let’s talk.</h2>
          <Link className="text-link" to="/contacto">Contact <span>↗</span></Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
