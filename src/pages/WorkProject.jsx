import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import MasonryThumbGrid from '../components/MasonryThumbGrid';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { nextProjectInSequence } from '../projectNavigation';
import { useSiteContent } from '../siteContent';

export default function WorkProject() {
  const { slug } = useParams();
  const { projects } = useSiteContent('work');
  const global = useSiteContent('global');
  const { t } = useLanguage();
  const project = projects.find(item => item.slug === slug);
  const nextProject = nextProjectInSequence(projects, slug);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const slides = project?.images || [];

  if (!project) return <Navigate to="/work/unfixed-landscapes" replace />;
  return (
    <div className="site-page project-page">
      <Header />
      <main className="project-main">
        <section className="project-detail-intro" aria-labelledby="project-title">
          <div className="project-detail-grid">
            <nav className="project-detail-nav project-detail-back" aria-label={t('projectNavigation')}>
              <Link to="/work" aria-label={t('backToWork')}>
                <span className="project-arrow" aria-hidden="true">←</span>
                <span className="visually-hidden">{t('backToWork')}</span>
              </Link>
            </nav>
            <nav className="project-detail-nav project-detail-next" aria-label={t('nextProject')}>
              {nextProject && (
                <Link to={`/work/${nextProject.slug}`} aria-label={`${t('nextProject')}: ${nextProject.title}`}>
                  <span className="project-arrow" aria-hidden="true">→</span>
                  <span className="visually-hidden">{t('nextProject')}: {nextProject.title}</span>
                </Link>
              )}
            </nav>
            <div className="project-detail-meta">
              <h1 id="project-title">{project.title}</h1>
            </div>
            <EditorialIntroCopy
              text={project.intro || t('projectFallback')}
            />
          </div>
        </section>

        {slides.length ? (
          <section className="project-archive" aria-label={`${project.title}: ${t('projectImages')}`}>
            <MasonryThumbGrid
              items={slides}
              keyPrefix={slug}
              getKey={artwork => `${slug}-${artwork.id}`}
              onOpen={(_artwork, index) => { setStartIndex(index); setOpen(true); }}
            />
          </section>
        ) : <p className="empty-state">{global.noImagesLabel}</p>}
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title}: ${t('slideshow')}`} context={project.title} />
    </div>
  );
}
