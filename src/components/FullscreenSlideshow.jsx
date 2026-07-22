import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../siteContent';

export default function FullscreenSlideshow({ artworks, open, initialIndex = 0, onClose, label = 'Artwork slideshow' }) {
  const global = useSiteContent('global');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const pointerStart = useRef(null);
  const closeButton = useRef(null);
  const videoRefs = useRef(new Map());
  const activeArtwork = artworks[index];
  const activeArtworkIsVideo = activeArtwork?.mediaType === 'video';

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
    if (!open || !playing || activeArtworkIsVideo || artworks.length < 2) return undefined;
    const timer = window.setInterval(() => move(1), 5500);
    return () => window.clearInterval(timer);
  }, [open, playing, activeArtworkIsVideo, artworks.length]);

  useEffect(() => {
    videoRefs.current.forEach((video, videoIndex) => {
      if (videoIndex !== index || !open) video.pause();
    });
  }, [index, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === ' ' && event.target.tagName !== 'VIDEO') {
        event.preventDefault();
        setPlaying(value => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, artworks.length, onClose]);

  if (!open || !artworks.length) return null;
  const artwork = activeArtwork;

  return (
    <div
      className="fullscreen-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onPointerDown={event => { pointerStart.current = event.clientX; }}
      onPointerUp={event => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        if (Math.abs(distance) > 55) move(distance > 0 ? -1 : 1);
        pointerStart.current = null;
      }}
    >
      <header className="slideshow-header">
        <span className="slideshow-brand">{global.artistName}</span>
        <div>
          <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? global.pauseLabel : global.playLabel}</button>
          <button ref={closeButton} type="button" onClick={onClose}>{global.closeLabel}</button>
        </div>
      </header>
      <div className="slideshow-stage">
        {artworks.map((item, itemIndex) => (
          <figure className={itemIndex === index ? 'is-current' : ''} key={item.id} aria-hidden={itemIndex !== index}>
            {item.mediaType === 'video' ? (
              <video
                ref={video => {
                  if (video) videoRefs.current.set(itemIndex, video);
                  else videoRefs.current.delete(itemIndex);
                }}
                controls
                playsInline
                preload="metadata"
                src={item.imageUrl}
                poster={item.posterUrl}
                aria-label={item.alt || item.title}
                onPlay={() => setPlaying(false)}
              />
            ) : <img src={item.imageUrl} alt={item.alt || item.title} />}
          </figure>
        ))}
      </div>
      <footer className="slideshow-footer">
        <div className="slide-caption">
          <span>{artwork.series}</span>
          <h2>{artwork.title}</h2>
          <p>{artwork.technique}</p>
        </div>
        <div className="slide-navigation">
          <button type="button" onClick={() => move(-1)} aria-label="Previous artwork">←</button>
          <span>{String(index + 1).padStart(2, '0')} / {String(artworks.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next artwork">→</button>
        </div>
        <div className="slide-progress" aria-hidden="true"><span key={`${index}-${playing}`} className={playing ? 'is-playing' : ''} /></div>
      </footer>
    </div>
  );
}
