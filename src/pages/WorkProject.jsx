import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
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
  const coverSlide = slides[0];

  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        {!coverSlide ? <p className="empty-state">{global.noImagesLabel}</p> : (
          <>
          <section className="editorial-intro project-preview" aria-label={project.title}>
            {coverSlide.mediaType === 'video' ? (
              <div className="editorial-intro-image editorial-intro-video">
                <video controls playsInline preload="metadata" src={coverSlide.imageUrl} poster={coverSlide.posterUrl} aria-label={coverSlide.alt || coverSlide.title} />
              </div>
            ) : (
              <button
                className="editorial-intro-image image-open-button"
                type="button"
                onClick={() => { setStartIndex(0); setOpen(true); }}
                aria-label={`Open ${project.title} slideshow`}
              >
                <img key={`${slug}-${coverSlide.id}`} src={coverSlide.imageUrl} alt={coverSlide.alt || coverSlide.title} />
              </button>
            )}
            <EditorialIntroCopy
              title={project.title}
              text={project.intro || 'A focused selection from the project archive, arranged for browsing before entering the full slideshow.'}
            >
              <button className="tour-button project-start-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }}>
                <span>{global.startViewingLabel}</span><b>→</b>
              </button>
            </EditorialIntroCopy>
          </section>

          <section className="project-archive" aria-label={`${project.title} images`}>
            <MasonryThumbGrid
              items={gridSlides}
              keyPrefix={slug}
              getKey={artwork => `${slug}-${artwork.id}`}
              onOpen={artwork => { setStartIndex(artwork.slideIndex); setOpen(true); }}
            />
          </section>
          </>
        )}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
