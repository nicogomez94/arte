import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function ExhibitionProject() {
  const { slug } = useParams();
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const project = exhibitionProjects.find(item => item.slug === slug);
  const slides = project?.images || [];
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!project) return <Navigate to="/exhibitions" replace />;
  return (
    <div className="site-page gallery-page project-page">
      <Header />
      <main className="project-main">
        <section className="project-detail-intro" aria-labelledby="exhibition-title">
          <Link className="back-home-link" to="/">← Back to home</Link>
          <div className="project-detail-grid">
            <div className="project-detail-meta">
              <h1 id="exhibition-title">{project.title}</h1>
            </div>
            <EditorialIntroCopy
              title="About the exhibition"
              text={project.intro || 'Selected exhibition documentation from the archive.'}
            />
          </div>
        </section>

        {slides.length ? (
          <section className="gallery-archive" id="selected" aria-label={`${project.title} images`}>
            <MasonryThumbGrid
              items={slides}
              keyPrefix={slug}
              getKey={artwork => artwork.id}
              onOpen={(_artwork, index) => { setStartIndex(index); setOpen(true); }}
            />
          </section>
        ) : <p className="empty-state">No images available.</p>}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
