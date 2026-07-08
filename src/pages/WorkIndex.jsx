import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { workIndexItems } from '../projectAssets';

const toColumns = items => items.reduce((columns, item, index) => {
  columns[index % 4].push(item);
  return columns;
}, [[], [], [], []]);

export default function WorkIndex() {
  const columns = toColumns(workIndexItems);

  return (
    <div className="site-page index-page">
      <Header />
      <main className="visual-index-main" aria-label="Work index">
        <div className="visual-index-grid">
          {columns.map((column, columnIndex) => (
            <div className="visual-index-column" key={columnIndex}>
              {column.map((item, itemIndex) => (
                <Link className={`visual-index-card visual-index-card-${(columnIndex + itemIndex) % 6}`} to={`/work/${item.slug}`} key={item.slug}>
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
