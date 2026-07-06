import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';

export default function About() {
  return (
    <div className="site-page about-page">
      <Header />
      <main>
        <section className="about-hero">
          <div className="about-heading reveal">
            <span className="eyebrow">About</span>
            <h1>Andrea<br /><em>Alkalay</em></h1>
            <p>Visual artist · Buenos Aires, Argentina</p>
          </div>
          <figure className="about-portrait reveal-delay">
            <img src="/exhibicion-03.png" alt="Andrea Alkalay artwork in an exhibition space" />
          </figure>
        </section>

        <section className="about-statement">
          <div className="about-statement-label"><span className="eyebrow">Practice</span></div>
          <div className="about-copy">
            <h2>Landscape as<br /><em>a living archive.</em></h2>
            <div className="about-columns">
              <p>Her practice moves between photography, material research and installation.</p>
              <p>Images become objects, spaces and traces of memory.</p>
            </div>
          </div>
        </section>

        <section className="about-detail">
          <figure>
            <img src="/exhibicion-01.png" alt="Andrea Alkalay installation at Soulangh Cultural Park" />
            <figcaption>Soulangh Cultural Park · Taiwan · 2026</figcaption>
          </figure>
          <div className="about-detail-copy">
            <span className="eyebrow">Matter &amp; territory</span>
            <h2>Photography<br />beyond the frame.</h2>
            <dl className="about-facts">
              <div><dt>Based</dt><dd>Buenos Aires, Argentina</dd></div>
              <div><dt>Education</dt><dd>Industrial Design · UBA</dd></div>
              <div><dt>Media</dt><dd>Photography · installation · collage</dd></div>
            </dl>
            <Link className="text-link" to="/work/unfixed-landscapes">View work <span>→</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
