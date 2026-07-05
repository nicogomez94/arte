import { Footer, Header } from '../components/SiteChrome';

export default function Contact() {
  return (
    <div className="site-page contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero">
          <div className="contact-heading reveal">
            <span className="eyebrow">Contacto</span>
            <h1>Hablemos de<br /><em>la próxima obra.</em></h1>
            <p>Para consultas sobre exhibiciones, colaboraciones, prensa y disponibilidad de obra.</p>
          </div>
          <div className="contact-directory reveal-delay">
            <span className="directory-label">Canales directos</span>
            <a href="mailto:info@andrealkalay.com">
              <span>Correo</span>
              <strong>info@andrealkalay.com</strong>
              <b>↗</b>
            </a>
            <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer">
              <span>Instagram</span>
              <strong>@andrealkalay</strong>
              <b>↗</b>
            </a>
            <a href="https://www.andrealkalay.com/" target="_blank" rel="noopener noreferrer">
              <span>Sitio</span>
              <strong>andrealkalay.com</strong>
              <b>↗</b>
            </a>
          </div>
        </section>

        <section className="contact-visual">
          <figure>
            <img src="/exhibicion-02.png" alt="Detalle de una exhibición de Andrea Alkalay" />
            <figcaption>Buenos Aires ↔ proyectos internacionales</figcaption>
          </figure>
          <div>
            <span className="eyebrow">Estudio</span>
            <h2>Buenos Aires,<br />Argentina</h2>
            <p>Las consultas se responden por correo electrónico. Para seguir procesos, exhibiciones y obra reciente, el canal más activo es Instagram.</p>
            <a className="outline-link" href="mailto:info@andrealkalay.com?subject=Consulta%20desde%20el%20sitio">Escribir un correo</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
