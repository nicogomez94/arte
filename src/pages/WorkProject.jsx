import { useEffect, useMemo, useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { api } from '../api';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header, Loading } from '../components/SiteChrome';
import { findProject, projects } from '../projects';

export default function WorkProject() {
  const { slug } = useParams();
  const project = findProject(slug);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  const projectIndex = Math.max(0, projects.findIndex(item => item.slug === slug));
  const slides = useMemo(() => {
    if (!artworks.length) return [];
    const offset = projectIndex % artworks.length;
    return [...artworks.slice(offset), ...artworks.slice(0, offset)];
  }, [artworks, projectIndex]);

  if (!project) return <Navigate to="/work/unfixed-landscapes" replace />;
  const coverSlide = slides[0];

  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        <header className="project-heading">
          <span className="eyebrow">Work · {String(projectIndex + 1).padStart(2, '0')}</span>
          <h1>{project.title}</h1>
        </header>

        {loading ? <Loading /> : !coverSlide ? <p className="empty-state">No images available.</p> : (
          <section className="project-preview" aria-label={project.title}>
            <button
              className="project-stage image-open-button"
              type="button"
              onClick={() => { setStartIndex(0); setOpen(true); }}
              aria-label={`Open ${project.title} slideshow`}
            >
              <img key={`${slug}-${coverSlide.id}`} src={coverSlide.imageUrl} alt={coverSlide.alt || coverSlide.title} />
            </button>
            <button className="tour-button project-start-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }}>
              <span>Start viewing</span><b>→</b>
            </button>
          </section>
        )}

        <nav className="project-index" aria-label="Other work">
          {projects.map(item => <Link className={item.slug === slug ? 'is-current' : ''} key={item.slug} to={`/work/${item.slug}`}>{item.title}</Link>)}
        </nav>
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
