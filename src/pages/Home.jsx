import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header, Loading } from '../components/SiteChrome';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  const heroSlides = artworks.length ? artworks : [{
    id: 'home-hero',
    imageUrl: '/exhibicion-01.png',
    alt: 'Andrea Alkalay installation at Soulangh Cultural Park',
    title: 'Unfixed Landscapes',
    series: 'Soulangh Cultural Park, Taiwan',
    year: '2026',
    technique: 'Art photography'
  }];

  return (
    <div className="site-page">
      <Header />
      <main>
        <section className="home-hero" aria-label="Andrea Alkalay exhibition">
          <figure className="hero-image reveal">
            <button className="hero-image-button" type="button" onClick={() => setSlideshowOpen(true)} aria-label="Open homepage slideshow">
              <img src="/exhibicion-01.png" alt="Andrea Alkalay installation at Soulangh Cultural Park" />
            </button>
            <figcaption>Unfixed Landscapes · Soulangh Cultural Park, Taiwan · 2026</figcaption>
          </figure>
          {/* <a className="hero-scroll-cue" href="#portfolio" aria-label="Scroll to work">↓</a> */}
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
      <FullscreenSlideshow artworks={heroSlides} open={slideshowOpen} initialIndex={0} onClose={() => setSlideshowOpen(false)} label="Homepage slideshow" />
    </div>
  );
}
