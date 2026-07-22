import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function WorkProject() {
  const { slug } = useParams();
  const { projects } = useSiteContent('work');
  const global = useSiteContent('global');
  const project = projects.find(item => item.slug === slug);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const slides = project?.images || [];
  const gridSlides = (project?.gridImages || slides).map((slide, index) => ({ ...slide, slideIndex: slide.slideIndex ?? index }));

  if (!project) return <Navigate to="/work/unfixed-landscapes" replace />;
  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        <section className="project-detail-intro" aria-labelledby="project-title">
          <Link className="back-home-link" to="/">← Back to home</Link>
          <div className="project-detail-grid">
            <div className="project-detail-meta">
              <h1 id="project-title">{project.title}</h1>
            </div>
            <EditorialIntroCopy
              title="statement"
              text={project.intro || 'A focused selection from the project archive.'}
            />
          </div>
        </section>

        {slides.length ? (
          <section className="project-archive" aria-label={`${project.title} images`}>
            <MasonryThumbGrid
              items={gridSlides}
              keyPrefix={slug}
              getKey={artwork => `${slug}-${artwork.id}`}
              onOpen={artwork => { setStartIndex(artwork.slideIndex); setOpen(true); }}
            />
          </section>
        ) : <p className="empty-state">{global.noImagesLabel}</p>}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
