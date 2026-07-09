import { Link } from 'react-router-dom';
import { Header } from '../components/SiteChrome';

export default function Home() {
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
      </main>
    </div>
  );
}
