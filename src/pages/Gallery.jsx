import { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { Footer, Header, Loading } from '../components/SiteChrome';

function Slideshow({ artworks, open, initialIndex, onClose }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const pointerStart = useRef(null);
  const closeButton = useRef(null);

  const move = direction => setIndex(current => (current + direction + artworks.length) % artworks.length);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(initialIndex);
    setPlaying(true);
    document.body.classList.add('slideshow-open');
    window.setTimeout(() => closeButton.current?.focus(), 30);
    return () => document.body.classList.remove('slideshow-open');
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open || !playing || artworks.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 5500);
    return () => window.clearInterval(timer);
  }, [open, playing, artworks.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === ' ') { event.preventDefault(); setPlaying(value => !value); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, artworks.length, onClose]);

  if (!open || !artworks.length) return null;
  const artwork = artworks[index];

  return (
    <div
      className="fullscreen-gallery"
      role="dialog"
      aria-modal="true"
      aria-label="Recorrido de obras"
      onPointerDown={event => { pointerStart.current = event.clientX; }}
      onPointerUp={event => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
        pointerStart.current = null;
      }}
    >
      <header className="slideshow-header">
        <span className="slideshow-brand">andrea alkalay</span>
        <div><button type="button" onClick={() => setPlaying(value => !value)}>{playing ? 'pausar' : 'reproducir'}</button><button ref={closeButton} type="button" onClick={onClose}>cerrar ×</button></div>
      </header>
      <div className="slideshow-stage">
        {artworks.map((item, itemIndex) => (
          <figure className={itemIndex === index ? 'is-current' : ''} key={item.id} aria-hidden={itemIndex !== index}>
            <img src={item.imageUrl} alt={item.alt || item.title} />
          </figure>
        ))}
      </div>
      <footer className="slideshow-footer">
        <div className="slide-caption"><span>{artwork.series} · {artwork.year}</span><h2>{artwork.title}</h2><p>{artwork.technique}</p></div>
        <div className="slide-navigation">
          <button type="button" onClick={() => move(-1)} aria-label="Obra anterior">←</button>
          <span>{String(index + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => move(1)} aria-label="Obra siguiente">→</button>
        </div>
        <div className="slide-progress" aria-hidden="true"><span key={`${index}-${playing}`} className={playing ? 'is-playing' : ''} /></div>
      </footer>
    </div>
  );
}

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
            <span className="eyebrow">Archivo vivo · {artworks.length || '—'} obras</span>
            <h1>Proyectos<br />&amp; <em>obras</em></h1>
            <p>Investigaciones sobre paisaje, territorio y memoria que desbordan los límites de la imagen fotográfica.</p>
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!artworks.length}>
              <span>Empezar recorrido</span><b>→</b>
            </button>
          </div>
          <figure className="gallery-cover">
            <img src={artworks[0]?.imageUrl || '/exhibicion-01.png'} alt={artworks[0]?.alt || 'Vista de exhibición'} />
            <figcaption><span>Vista de sala</span><span>Taiwan · 2026</span></figcaption>
          </figure>
        </section>

        <section className="gallery-archive" id="archivo">
          <header><span className="eyebrow">Índice visual</span><p>También podés recorrer el archivo completo desde acá.</p></header>
          {loading ? <Loading /> : !artworks.length ? <p className="empty-state">Todavía no hay obras publicadas.</p> : (
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
      <Slideshow artworks={artworks} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} />
    </div>
  );
}
