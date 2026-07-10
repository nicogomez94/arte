import { Link } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function Home() {
  const content = useSiteContent('home');
  const { projects } = useSiteContent('work');
  const selectedProject = projects.find(project => project.slug === 'unfixed-landscapes') || projects[0];
  const selectedSlides = selectedProject?.images || [];
  const selectedGrid = (selectedProject?.gridImages || selectedSlides).slice(0, 3);
  const coverSlide = selectedSlides[0];

  return (
    <div className="site-page home-page">
      <Header />
      <main>
        <section className="home-hero" aria-label="Andrea Alkalay exhibition">
          <figure className="hero-image reveal">
            <Link className="hero-image-button" to="/work/unfixed-landscapes" aria-label="View Unfixed Landscapes">
              <img src={content.heroImageUrl} alt={content.heroImageAlt} />
            </Link>
            <figcaption>{content.heroCaption}</figcaption>
          </figure>
          {/* <a className="hero-scroll-cue" href="#portfolio" aria-label="Scroll to work">↓</a> */}
        </section>

        <section className="home-selected-work" aria-label="Selected work">
          <h3>{content.selectedWorkLabel}</h3>
          <section className="editorial-intro home-work-preview" aria-label={selectedProject.title}>
            <Link className="editorial-intro-image home-work-image" to="/work/unfixed-landscapes" aria-label="View Unfixed Landscapes">
              <img src={coverSlide?.imageUrl || '/exhibicion-01.png'} alt={coverSlide?.alt || 'Unfixed Landscapes'} />
            </Link>
            <EditorialIntroCopy title={selectedProject.title} text={selectedProject.intro}>
              <Link className="tour-button home-work-link" to="/work/unfixed-landscapes">
                <span>{content.viewWorkLabel}</span><b>→</b>
              </Link>
            </EditorialIntroCopy>
          </section>

          <div className="artwork-thumb-grid home-work-grid">
            {selectedGrid.map(artwork => (
              <Link key={`home-${artwork.id}`} to="/work/unfixed-landscapes" className="artwork-thumb">
                <img src={artwork.imageUrl} alt={artwork.alt || artwork.title || 'Unfixed Landscapes'} />
              </Link>
            ))}
          </div>
          <h3 className="home-view-more">
            <Link to="/work/unfixed-landscapes">{content.viewMoreLabel}</Link>
          </h3>
        </section>
      </main>
      <Footer />
    </div>
  );
}
