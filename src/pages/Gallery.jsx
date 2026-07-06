import { useEffect, useState } from 'react';
import { api } from '../api';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header, Loading } from '../components/SiteChrome';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="site-page gallery-page">
      <Header />
      <main>
        <section className="gallery-landing">
          <div className="gallery-title-block">
            <span className="eyebrow">Selected archive · {artworks.length || '—'} views</span>
            <h1>Exhibitions</h1>
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!artworks.length}>
              <span>Start viewing</span><b>→</b>
            </button>
          </div>
          <button
            className="gallery-cover image-open-button"
            type="button"
            onClick={() => { setStartIndex(0); setOpen(true); }}
            disabled={!artworks.length}
            aria-label="Open exhibitions slideshow"
          >
            <img src={artworks[0]?.imageUrl || '/exhibicion-01.png'} alt={artworks[0]?.alt || 'Exhibition view'} />
          </button>
        </section>

        <section className="gallery-archive" id="archivo">
          <header><span className="eyebrow">Index</span></header>
          {loading ? <Loading /> : !artworks.length ? <p className="empty-state">No works published yet.</p> : (
            <div className="archive-list">
              {artworks.map((artwork, index) => (
                <button type="button" key={artwork.id} onClick={() => { setStartIndex(index); setOpen(true); }} className="archive-row">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <img src={artwork.imageUrl} alt="" />
                  <div><h2>{artwork.title}</h2><p>{artwork.series}</p></div>
                  <em>{artwork.year}</em><b>↗</b>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <FullscreenSlideshow artworks={artworks} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} />
    </div>
  );
}
