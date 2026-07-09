import { useEffect, useState } from 'react';
import { api } from '../api';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header, Loading } from '../components/SiteChrome';
import { exhibitionAssets } from '../projectAssets';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  const slides = exhibitionAssets.length ? exhibitionAssets : artworks;

  return (
    <div className="site-page gallery-page">
      <Header />
      <main>
        <section className="editorial-intro gallery-landing">
          <button
            className="editorial-intro-image image-open-button"
            type="button"
            onClick={() => { setStartIndex(0); setOpen(true); }}
            disabled={!slides.length}
            aria-label="Open exhibitions slideshow"
          >
            <img src={slides[0]?.imageUrl || '/exhibicion-01.png'} alt={slides[0]?.alt || 'Exhibition view'} />
          </button>
          <EditorialIntroCopy
            title="Exhibitions"
            text="Installation views, visual research and exhibition fragments gathered as a quiet index of the work in space. This archive follows how each project changes when it meets a room, a route, a wall or an outdoor landscape. The images are not only records of display; they show scale, distance, light and the relation between works. Together they trace how the practice expands beyond the individual piece and becomes a spatial experience."
          >
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!slides.length}>
              <span>Start viewing</span><b>→</b>
            </button>
          </EditorialIntroCopy>
        </section>

        <section className="gallery-archive" id="selected">
          {loading && !exhibitionAssets.length ? <Loading /> : !slides.length ? <p className="empty-state">No works published yet.</p> : (
            <div className="artwork-thumb-grid">
              {slides.map((artwork, index) => (
                <button type="button" key={artwork.id} onClick={() => { setStartIndex(index); setOpen(true); }} className="artwork-thumb">
                  <img src={artwork.imageUrl} alt="" />
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} />
    </div>
  );
}
