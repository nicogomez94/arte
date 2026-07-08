import { Footer, Header } from '../components/SiteChrome';
import cvText from '../../texto.md?raw';

const headingLabels = new Map([
  ['art residencies & grants', 'Art Residencies & Grants'],
  ['publications', 'Publications'],
  ['artist book:', 'Artist Book'],
  ['solo exhibitions', 'Solo Exhibitions'],
  ['group exhibitions (selected)', 'Group Exhibitions (selected)'],
  ['honors (selected)', 'Honors (selected)']
]);

const cleanLine = line => line
  .replace(/[\u200B-\u200D\uFEFF]/g, '')
  .replace(/\u00A0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const getCvContent = () => {
  const lines = cvText
    .replace(/Taiwan2026/g, 'Taiwan\n2026')
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean);

  const [intro = '', ...body] = lines;
  const sections = [];
  let current = null;

  body.forEach(line => {
    const key = line.toLowerCase().replace(/\s+:/g, ':');
    if (headingLabels.has(key)) {
      current = { title: headingLabels.get(key), items: [] };
      sections.push(current);
      return;
    }
    if (current) current.items.push(line);
  });

  return { intro, sections };
};

export default function Cv() {
  const { intro, sections } = getCvContent();

  return (
    <div className="site-page cv-page">
      <Header />
      <main className="cv-main">
        <section className="cv-hero" aria-label="Andrea Alkalay CV">
          <figure className="cv-portrait reveal">
            <img src="/contact/Andrea-Alkalay.jpg.avif" alt="Andrea Alkalay" />
          </figure>
          <div className="cv-intro reveal-delay">
            <p>{intro}</p>
          </div>
        </section>

        <section className="cv-sections" aria-label="CV details">
          {sections.map(section => (
            <article className="cv-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, index) => (
                  <li key={`${section.title}-${index}`}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
