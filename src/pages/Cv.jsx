import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

const cvItemLinks = [
  ['talking pictures', 'https://talking-pictures.online/2025/08/13/andrea-alkalay-sediments-of-time/'],
  ['aal mag', 'https://www.instagram.com/p/DLa_jqEOAir/'],
  ['see-zeen photo mag', 'https://see-zeen.com/andrea-alkalay'],
  ['art amalgama', 'https://www.artamalgama.com/artists-1/andrea-alkalay'],
  ['atrum art', 'https://www.atrumart.com/artists/544'],
  ['f-stop interview', 'https://www.fstopmagazine.com/blog/2023/interview-with-featured-photographer-andrea-alkalay/'],
  ['lenscratch', 'http://lenscratch.com/2022/06/andrea-alkalay-landscape-on-landscape/'],
  ['aethetica mag', 'https://issuu.com/aesthetica_magazine/docs/aesthetica-issue107?fr=sMWQ3ODQ4NTY2MTM'],
  ['world photography organization', 'https://www.worldphoto.org/blogs/06-08-21/breaking-boundaries-andrea-alkalay'],
  ['phmuseum kutho', 'https://phmuseum.com/galleries/kutho'],
  ['float magazine', 'https://www.floatmagazine.us/portfolios/andrea-alkalay'],
  ['artdoc photography magazine', 'https://www.artdoc.photo/articles/ancient-relationship-between-gold-and-religion'],
  ['art fluent', 'https://www.art-fluent.com/andrea-alkalay'],
  ['uncertain nature', 'https://issuu.com/andreaalkalay/docs/naturaleza_incierta']
];

const normalizeCvItem = item => item.toLowerCase().replace(/\s+/g, ' ').trim();
const findCvItemLink = item => {
  const normalizedItem = normalizeCvItem(item);
  return cvItemLinks.find(([label]) => normalizedItem.includes(label))?.[1];
};

export default function Cv() {
  const content = useSiteContent('cv');

  return (
    <div className="site-page cv-page">
      <Header />
      <main className="cv-main">
        <section className="cv-hero" aria-label="Andrea Alkalay CV">
          <figure className="cv-portrait reveal">
            <img src={content.imageUrl} alt={content.imageAlt} />
          </figure>
          <div className="cv-intro reveal-delay">
            <h4>{content.introLabel}</h4>
            <p>{content.intro}</p>
          </div>
        </section>

        <section className="cv-sections" aria-label="CV details">
          {content.sections.map(section => (
            <article className="cv-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, index) => {
                  const itemLink = ['Publications', 'Artist Book'].includes(section.title)
                    ? findCvItemLink(item)
                    : undefined;
                  return (
                    <li key={`${section.title}-${index}`}>
                      {itemLink ? (
                        <a href={itemLink} target="_blank" rel="noopener noreferrer">
                          <span>{item}</span><span className="cv-external-mark" aria-hidden="true">↗</span>
                        </a>
                      ) : item}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
