import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Footer, Header, Loading } from '../components/SiteChrome';
import { findProject, projects } from '../projects';

export default function WorkProject() {
  const { slug } = useParams();
  const project = findProject(slug);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const pointerStart = useRef(null);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  const projectIndex = Math.max(0, projects.findIndex(item => item.slug === slug));
  const slides = useMemo(() => {
    if (!artworks.length) return [];
    const offset = projectIndex % artworks.length;
    return [...artworks.slice(offset), ...artworks.slice(0, offset)];
  }, [artworks, projectIndex]);

  useEffect(() => setIndex(0), [slug]);

  useEffect(() => {
    const onKey = event => {
      if (event.key === 'ArrowLeft') setIndex(current => (current - 1 + slides.length) % slides.length);
      if (event.key === 'ArrowRight') setIndex(current => (current + 1) % slides.length);
    };
    if (slides.length) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  if (!project) return <Navigate to="/work/unfixed-landscapes" replace />;
  const move = direction => setIndex(current => (current + direction + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        <header className="project-heading">
          <span className="eyebrow">Work · {String(projectIndex + 1).padStart(2, '0')}</span>
          <h1>{project.title}</h1>
        </header>

        {loading ? <Loading /> : !slide ? <p className="empty-state">No images available.</p> : (
          <section
            className="project-slideshow"
            aria-label={`${project.title} slideshow`}
            onPointerDown={event => { pointerStart.current = event.clientX; }}
            onPointerUp={event => {
              if (pointerStart.current === null) return;
              const distance = event.clientX - pointerStart.current;
              if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1);
              pointerStart.current = null;
            }}
          >
            <div className="project-stage">
              <img key={`${slug}-${slide.id}`} src={slide.imageUrl} alt={slide.alt || slide.title} />
              <button className="project-hit project-hit-prev" type="button" onClick={() => move(-1)} aria-label="Previous image">←</button>
              <button className="project-hit project-hit-next" type="button" onClick={() => move(1)} aria-label="Next image">→</button>
            </div>
            <footer className="project-controls">
              <span>{slide.title} · {slide.year}</span>
              <div><button type="button" onClick={() => move(-1)}>←</button><span>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><button type="button" onClick={() => move(1)}>→</button></div>
            </footer>
          </section>
        )}

        <nav className="project-index" aria-label="Other work">
          {projects.map(item => <Link className={item.slug === slug ? 'is-current' : ''} key={item.slug} to={`/work/${item.slug}`}>{item.title}</Link>)}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
