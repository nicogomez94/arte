import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { nextProjectInSequence } from '../projectNavigation';
import { useSiteContent } from '../siteContent';

export default function ExhibitionProject() {
  const { slug } = useParams();
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const { t } = useLanguage();
  const project = exhibitionProjects.find(item => item.slug === slug);
  const projectGroup = project ? exhibitionProjects.filter(item => item.category === project.category) : [];
  const nextProject = nextProjectInSequence(projectGroup, slug);
  const slides = project?.images || [];
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!project) return <Navigate to="/exhibitions" replace />;
  return (
    <div className="site-page gallery-page project-page">
      <Header />
      <main className="project-main">
        <section className="project-detail-intro" aria-labelledby="exhibition-title">
          <div className="project-detail-grid">
            {/* Project navigation intentionally hidden. Keep this markup ready in case it returns.
            <nav className="project-detail-nav project-detail-back" aria-label={t('projectNavigation')}>
              <Link to={`/exhibitions#${project.category}-show`} aria-label={t('backToExhibitions')}>
                <span className="project-arrow" aria-hidden="true">←</span>
                <span className="visually-hidden">{t('backToExhibitions')}</span>
              </Link>
            </nav>
            <nav className="project-detail-nav project-detail-next" aria-label={t('nextProject')}>
              {nextProject && (
                <Link to={`/exhibitions/${nextProject.slug}`} aria-label={`${t('nextProject')}: ${nextProject.title}`}>
                  <span className="project-arrow" aria-hidden="true">→</span>
                  <span className="visually-hidden">{t('nextProject')}: {nextProject.title}</span>
                </Link>
              )}
            </nav> */}
            <div className="project-detail-meta">
              <h1 id="exhibition-title">{project.title}</h1>
            </div>
            <EditorialIntroCopy
              text={project.intro || t('exhibitionFallback')}
            />
          </div>
        </section>

        {slides.length ? (
          <section className="gallery-archive" id="selected" aria-label={`${project.title}: ${t('projectImages')}`}>
            <MasonryThumbGrid
              items={slides}
              keyPrefix={slug}
              getKey={artwork => artwork.id}
              onOpen={(_artwork, index) => { setStartIndex(index); setOpen(true); }}
              showCaptions
            />
          </section>
        ) : <p className="empty-state">{t('noImages')}</p>}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title}: ${t('slideshow')}`} context={project.title} />
    </div>
  );
}
