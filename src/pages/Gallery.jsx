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
        <section className="editorial-intro gallery-landing">
          <button
            className="editorial-intro-image image-open-button"
            type="button"
            onClick={() => { setStartIndex(0); setOpen(true); }}
            disabled={!artworks.length}
            aria-label="Open exhibitions slideshow"
          >
            <img src={artworks[0]?.imageUrl || '/exhibicion-01.png'} alt={artworks[0]?.alt || 'Exhibition view'} />
          </button>
          <div className="editorial-intro-copy">
            <span className="eyebrow">Selected archive · {artworks.length || '—'} views</span>
            <h3>Exhibitions</h3>
            <p>Installation views, visual research and exhibition fragments gathered as a quiet index of the work in space.</p>
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!artworks.length}>
              <span>Start viewing</span><b>→</b>
            </button>
          </div>
        </section>

        <section className="gallery-archive" id="archivo">
          {loading ? <Loading /> : !artworks.length ? <p className="empty-state">No works published yet.</p> : (
            <div className="artwork-thumb-grid">
              {artworks.map((artwork, index) => (
                <button type="button" key={artwork.id} onClick={() => { setStartIndex(index); setOpen(true); }} className="artwork-thumb">
                  <img src={artwork.imageUrl} alt="" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{artwork.title}</h2>
                    <p>{artwork.series} · {artwork.year}</p>
                  </div>
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
