import { Footer, Header } from '../components/SiteChrome';

export default function Contact() {
  return (
    <div className="site-page contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero">
          <div className="contact-heading reveal">
            <span className="eyebrow">Contact</span>
            <h1>Let’s<br /><em>connect.</em></h1>
            <p>Exhibitions, collaborations and press.</p>
          </div>
          <div className="contact-directory reveal-delay">
            <span className="directory-label">Direct</span>
            <a href="mailto:info@andrealkalay.com"><span>Email</span><strong>info@andrealkalay.com</strong><b>↗</b></a>
            <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer"><span>Instagram</span><strong>@andrealkalay</strong><b>↗</b></a>
            <a href="https://www.andrealkalay.com/" target="_blank" rel="noopener noreferrer"><span>Website</span><strong>andrealkalay.com</strong><b>↗</b></a>
          </div>
        </section>

        <section className="contact-visual">
          <figure><img src="/exhibicion-02.png" alt="Detail of an Andrea Alkalay exhibition" /></figure>
          <div>
            <span className="eyebrow">Studio</span>
            <h2>Buenos Aires,<br />Argentina</h2>
            <a className="text-link" href="mailto:info@andrealkalay.com?subject=Website%20inquiry">Write an email <span>↗</span></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
