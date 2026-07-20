import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function ExhibitionProject() {
  const { slug } = useParams();
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const global = useSiteContent('global');
  const project = exhibitionProjects.find(item => item.slug === slug);
  const slides = project?.images || [];
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!project) return <Navigate to="/exhibitions" replace />;
  const coverSlide = slides[0];

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
            aria-label={`Open ${project.title} slideshow`}
          >
            <img src={project.imageUrl || coverSlide?.imageUrl} alt={coverSlide?.alt || project.title} />
          </button>
          <EditorialIntroCopy title={project.title} text={`${project.year}. ${project.intro || 'Selected exhibition documentation from the archive.'}`}>
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!slides.length}>
              <span>{global.startViewingLabel}</span><b>→</b>
            </button>
          </EditorialIntroCopy>
        </section>

        <section className="gallery-archive" id="selected">
          <MasonryThumbGrid
            items={slides}
            keyPrefix={slug}
            getKey={artwork => artwork.id}
            onOpen={(_artwork, index) => { setStartIndex(index); setOpen(true); }}
          />
        </section>
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
