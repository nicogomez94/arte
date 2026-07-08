import { useEffect, useMemo, useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { api } from '../api';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header, Loading } from '../components/SiteChrome';
import { projectAssets } from '../projectAssets';
import { findProject, projects } from '../projects';

export default function WorkProject() {
  const { slug } = useParams();
  const project = findProject(slug);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const hasProjectAssets = Boolean(projectAssets[slug]?.length);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([])).finally(() => setLoading(false));
  }, []);

  const projectIndex = Math.max(0, projects.findIndex(item => item.slug === slug));
  const slides = useMemo(() => {
    if (projectAssets[slug]?.length) return projectAssets[slug];
    if (!artworks.length) return [];
    const offset = projectIndex % artworks.length;
    return [...artworks.slice(offset), ...artworks.slice(0, offset)];
  }, [artworks, projectIndex, slug]);

  if (!project) return <Navigate to="/work/unfixed-landscapes" replace />;
  const coverSlide = slides[0];

  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        {loading && !hasProjectAssets ? <Loading /> : !coverSlide ? <p className="empty-state">No images available.</p> : (
          <>
          <section className="editorial-intro project-preview" aria-label={project.title}>
            <button
              className="editorial-intro-image image-open-button"
              type="button"
              onClick={() => { setStartIndex(0); setOpen(true); }}
              aria-label={`Open ${project.title} slideshow`}
            >
              <img key={`${slug}-${coverSlide.id}`} src={coverSlide.imageUrl} alt={coverSlide.alt || coverSlide.title} />
            </button>
            <div className="editorial-intro-copy">
              <h3>{project.title}</h3>
              <p>A focused selection from the project archive, arranged for browsing before entering the full slideshow.</p>
              <button className="tour-button project-start-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }}>
                <span>Start viewing</span><b>→</b>
              </button>
            </div>
          </section>

          <section className="project-archive" aria-label={`${project.title} images`}>
            <div className="artwork-thumb-grid">
              {slides.map((artwork, index) => (
                <button type="button" key={`${slug}-${artwork.id}`} onClick={() => { setStartIndex(index); setOpen(true); }} className="artwork-thumb">
                  <img src={artwork.imageUrl} alt="" />
                </button>
              ))}
            </div>
          </section>
          </>
        )}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
