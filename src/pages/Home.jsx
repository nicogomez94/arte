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
        <section className="home-hero">
          <div className="hero-copy reveal">
            <span className="eyebrow">Buenos Aires · Fotografía expandida</span>
            <h1>Andrea<br /><em>Alkalay</em></h1>
            <p>Artista visual &amp; medios mixtos</p>
            <Link className="text-link" to="/galeria">Ver portfolio <span>↗</span></Link>
          </div>
          <figure className="hero-image reveal-delay">
            <img src="/exhibicion-01.png" alt="Exhibición de Andrea Alkalay" />
            <figcaption>Soulangh Cultural Park · Taiwan · 2026</figcaption>
          </figure>
          <span className="hero-index">AA / 01</span>
        </section>

        <section className="artist-intro" id="artista">
          <figure>
            <img src="/exhibicion-03.png" alt="Obra de Andrea Alkalay en exhibición" />
            <figcaption>La imagen como superficie sensible</figcaption>
          </figure>
          <div className="artist-copy">
            <span className="eyebrow">La artista</span>
            <h2>Paisaje, materia<br />y memoria</h2>
            <p>Andrea Alkalay es artista visual y diseñadora industrial graduada de la Universidad de Buenos Aires. Su práctica se despliega en la intersección entre fotografía, materialidad e investigación.</p>
            <p>Su obra entiende el paisaje y el territorio como archivos sensibles de memoria, expandiendo la imagen hacia la instalación, el collage y otros medios.</p>
            <Link className="outline-link" to="/galeria">Explorar galería</Link>
          </div>
        </section>

        <section className="portfolio-section" id="portfolio">
          <header className="section-heading">
            <div><span className="eyebrow">Archivo seleccionado</span><h2>Obras</h2></div>
            <Link to="/galeria">Ver recorrido completo →</Link>
          </header>
          {loading ? <Loading /> : (
            <div className="art-grid">
              {artworks.slice(0, 6).map((artwork, index) => (
                <article className={`art-card art-card-${index % 3}`} key={artwork.id}>
                  <Link to="/galeria" aria-label={`Ver ${artwork.title} en la galería`}>
                    <div className="art-image"><img src={artwork.imageUrl} alt={artwork.alt || artwork.title} /></div>
                    <div className="art-meta"><span>{String(index + 1).padStart(2, '0')}</span><h3>{artwork.title}</h3><p>{artwork.series} · {artwork.year}</p></div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="home-contact" id="contacto">
          <span className="eyebrow">Consultas &amp; colaboraciones</span>
          <h2>Hablemos de<br /><em>la próxima obra.</em></h2>
          <a className="text-link light" href="mailto:info@andrealkalay.com">Escribirme <span>↗</span></a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
