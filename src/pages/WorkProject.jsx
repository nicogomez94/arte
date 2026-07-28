import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function WorkProject() {
  const { slug } = useParams();
  const { projects } = useSiteContent('work');
  const global = useSiteContent('global');
  const { t } = useLanguage();
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
          <div className="project-detail-grid">
            <div className="project-detail-meta">
              <h1 id="project-title">{project.title}</h1>
            </div>
            <EditorialIntroCopy
              title={t('statement')}
              text={project.intro || t('projectFallback')}
            />
          </div>
        </section>

        {slides.length ? (
          <section className="project-archive" aria-label={`${project.title}: ${t('projectImages')}`}>
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
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title}: ${t('slideshow')}`} />
    </div>
  );
}
