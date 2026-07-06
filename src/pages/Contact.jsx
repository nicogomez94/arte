import { Footer, Header } from '../components/SiteChrome';

export default function Contact() {
  return (
    <div className="site-page contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-hero">
          <figure className="contact-portrait reveal">
            <img src="/exhibicion-03.png" alt="Andrea Alkalay exhibition detail" />
          </figure>
          <div className="contact-content reveal-delay">
            <div className="contact-heading">
              <span className="eyebrow">Contact</span>
              <h1>Let’s connect.</h1>
              <p>Exhibitions, collaborations and press.</p>
            </div>
            <div className="contact-directory">
              <a href="mailto:info@andrealkalay.com"><span>Email</span><strong>info@andrealkalay.com</strong><b>↗</b></a>
              <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer"><span>Instagram</span><strong>@andrealkalay</strong><b>↗</b></a>
              <a href="https://www.andrealkalay.com/" target="_blank" rel="noopener noreferrer"><span>Website</span><strong>andrealkalay.com</strong><b>↗</b></a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
