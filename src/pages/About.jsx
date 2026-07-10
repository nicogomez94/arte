import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

export default function About() {
  const content = useSiteContent('about');
  return (
    <div className="site-page about-page">
      <Header />
      <main>
        <section className="about-hero">
          <div className="about-heading reveal">
            <span className="eyebrow">{content.eyebrow}</span>
            <h1>{content.nameFirstLine}<br /><em>{content.nameSecondLine}</em></h1>
            <p>{content.role}</p>
          </div>
          <figure className="about-portrait reveal-delay">
            <img src={content.portraitImageUrl} alt={content.portraitImageAlt} />
          </figure>
        </section>

        <section className="about-statement">
          <div className="about-statement-label"><span className="eyebrow">{content.practiceLabel}</span></div>
          <div className="about-copy">
            <h2>{content.practiceTitle}</h2>
            <div className="about-columns">
              {content.practiceParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </div>
        </section>

        <section className="about-detail">
          <figure>
            <img src={content.detailImageUrl} alt={content.detailImageAlt} />
            <figcaption>{content.detailCaption}</figcaption>
          </figure>
          <div className="about-detail-copy">
            <span className="eyebrow">{content.detailLabel}</span>
            <h2>{content.detailTitle}</h2>
            <dl className="about-facts">
              {content.facts.map((fact, index) => <div key={index}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <Link className="text-link" to="/work/unfixed-landscapes">{content.linkLabel} <span>→</span></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
