import { Footer, Header } from '../components/SiteChrome';

export default function Statement() {
  return (
    <div className="site-page statement-page">
      <Header />
      <main className="statement-main">
        <section className="statement-layout" aria-labelledby="statement-title">
          <figure className="statement-image reveal">
            <img src="/contact/Andrea-Alkalay.jpg.avif" alt="Portrait of Andrea Alkalay" />
          </figure>

          <div className="statement-content reveal-delay">
            <article className="statement-section">
              <h1 id="statement-title">Statement</h1>
              <p>
                My practice unfolds at the expanded intersection of photography,
                materiality and research, approaching landscape and territory as
                sensitive archives of memory.
              </p>
              <p>
                I understand landscape not as a fixed view, but as a living system:
                a surface marked by time, pressure, displacement and care. Through
                photography, installation and material experimentation, I trace the
                subtle tensions between natural processes and human intervention.
              </p>
              <p>
                Images often leave the frame to become folded, suspended or wounded
                objects. Their physical transformations reveal the instability of
                what we see and the many layers of memory held within a territory.
              </p>
              <p>
                My work moves between observation and construction. Fragments of
                stone, textile, paper and photographic matter form temporary
                constellations in which erosion and repair coexist. Each gesture
                asks how an image can carry the evidence of change without becoming
                a closed document.
              </p>
              <p>
                I am interested in the material histories embedded in surfaces,
                and the ways memory is sedimented across time and place. Recent
                projects examine patterns of human care and neglect, mapping
                traces of use and abandonment to reveal unexpected continuities
                and relations between body and landscape.
              </p>
              <p>
                Rather than offering a complete narrative, I create spaces for
                pause and attentive looking. The landscape emerges as both evidence
                and question: an open archive where body, matter and memory remain
                in continuous transformation.
              </p>
            </article>

            <article className="statement-section statement-bio">
              <h2>Bio</h2>
              <p>
                Andrea Alkalay is an Argentine visual artist and industrial designer,
                graduated from the University of Buenos Aires. Based in Buenos Aires,
                her practice moves between photography, installation, collage and
                material research.
              </p>
              <p>
                Her work has been developed through exhibitions, residencies and
                grants in Argentina and internationally, exploring landscape and
                territory as spaces where memory, matter and transformation converge.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
