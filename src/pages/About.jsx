import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';

export default function About() {
  return (
    <div className="site-page about-page">
      <Header />
      <main>
        <section className="about-hero">
          <div className="about-heading reveal">
            <span className="eyebrow">Acerca de mí</span>
            <h1>Andrea<br /><em>Alkalay</em></h1>
            <p>Artista visual · Buenos Aires, Argentina</p>
          </div>
          <figure className="about-portrait reveal-delay">
            <img src="/exhibicion-03.png" alt="Obra de Andrea Alkalay en una sala de exhibición" />
            <figcaption><span>Práctica artística</span><span>Fotografía expandida</span></figcaption>
          </figure>
        </section>

        <section className="about-statement">
          <div className="about-statement-label">
            <span className="eyebrow">Práctica</span>
            <span className="statement-number">01 / 02</span>
          </div>
          <div className="about-copy">
            <h2>El paisaje como<br /><em>archivo sensible.</em></h2>
            <div className="about-columns">
              <p>Andrea Alkalay es artista visual y diseñadora industrial graduada de la Universidad de Buenos Aires. Su práctica se despliega en la intersección entre fotografía, materialidad e investigación.</p>
              <p>Su obra entiende el paisaje y el territorio como espacios donde la memoria deja huellas. La imagen se expande hacia la instalación, el collage, el bordado y otros medios.</p>
            </div>
          </div>
        </section>

        <section className="about-detail">
          <figure>
            <img src="/exhibicion-01.png" alt="Instalación de Andrea Alkalay en Soulangh Cultural Park" />
            <figcaption>Soulangh Cultural Park · Taiwan · 2026</figcaption>
          </figure>
          <div className="about-detail-copy">
            <span className="eyebrow">Materia &amp; territorio</span>
            <h2>La fotografía<br />fuera del marco</h2>
            <p>Cada proyecto parte de una observación: una superficie, un territorio, una transformación. A partir de allí, la fotografía deja de ser solamente registro para convertirse en objeto, montaje y experiencia espacial.</p>
            <dl className="about-facts">
              <div><dt>Base</dt><dd>Buenos Aires, Argentina</dd></div>
              <div><dt>Formación</dt><dd>Diseño Industrial · UBA</dd></div>
              <div><dt>Medios</dt><dd>Fotografía · instalación · collage</dd></div>
            </dl>
            <Link className="text-link" to="/galeria">Ver las obras <span>→</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
