import { Link } from 'react-router-dom';
import EditorialIntroCopy from '../components/EditorialIntroCopy';
import { Footer, Header } from '../components/SiteChrome';
import { projectAssets, projectGridAssets } from '../projectAssets';
import { findProject } from '../projects';

export default function Home() {
  const selectedProject = findProject('unfixed-landscapes');
  const selectedSlides = projectAssets['unfixed-landscapes'] || [];
  const selectedGrid = (projectGridAssets['unfixed-landscapes'] || selectedSlides).slice(0, 3);
  const coverSlide = selectedSlides[0];

  return (
    <div className="site-page home-page">
      <Header />
      <main>
        <section className="home-hero" aria-label="Andrea Alkalay exhibition">
          <figure className="hero-image reveal">
            <Link className="hero-image-button" to="/work/unfixed-landscapes" aria-label="View Unfixed Landscapes">
              <img src="/exhibicion-01.png" alt="Andrea Alkalay installation at Soulangh Cultural Park" />
            </Link>
            <figcaption>Unfixed Landscapes · Soulangh Cultural Park, Taiwan · 2026</figcaption>
          </figure>
          {/* <a className="hero-scroll-cue" href="#portfolio" aria-label="Scroll to work">↓</a> */}
        </section>

        <section className="home-selected-work" aria-label="Selected work">
          <h3>selected work</h3>
          <section className="editorial-intro home-work-preview" aria-label={selectedProject.title}>
            <Link className="editorial-intro-image home-work-image" to="/work/unfixed-landscapes" aria-label="View Unfixed Landscapes">
              <img src={coverSlide?.imageUrl || '/exhibicion-01.png'} alt={coverSlide?.alt || 'Unfixed Landscapes'} />
            </Link>
            <EditorialIntroCopy title={selectedProject.title} text={selectedProject.intro}>
              <Link className="tour-button home-work-link" to="/work/unfixed-landscapes">
                <span>View work</span><b>→</b>
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
            <Link to="/work/unfixed-landscapes">View more</Link>
          </h3>
        </section>
      </main>
      <Footer />
    </div>
  );
}
