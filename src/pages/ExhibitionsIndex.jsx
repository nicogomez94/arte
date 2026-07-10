import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { useSiteContent } from '../siteContent';

const toColumns = items => items.reduce((columns, item, index) => {
  columns[index % 4].push(item);
  return columns;
}, [[], [], [], []]);

export default function ExhibitionsIndex() {
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const columns = toColumns(exhibitionProjects);

  return (
    <div className="site-page index-page">
      <Header />
      <main className="visual-index-main" aria-label="Exhibitions index">
        <div className="visual-index-grid">
          {columns.map((column, columnIndex) => (
            <div className="visual-index-column" key={columnIndex}>
              {column.map((item, itemIndex) => (
                <Link className={`visual-index-card visual-index-card-${(columnIndex + itemIndex) % 6}`} to={`/exhibitions/${item.slug}`} key={item.slug}>
                  <img src={item.imageUrl} alt="" />
                  <h2>{item.title}</h2>
                  <p>{item.year}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
