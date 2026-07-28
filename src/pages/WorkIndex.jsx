import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

const toColumns = items => items.reduce((columns, item, index) => {
  columns[index % 4].push(item);
  return columns;
}, [[], [], [], []]);

export default function WorkIndex() {
  const { projects } = useSiteContent('work');
  const { t } = useLanguage();
  const columns = toColumns(projects);

  return (
    <div className="site-page index-page">
      <Header />
      <main className="visual-index-main" aria-label={t('workIndex')}>
        <div className="visual-index-grid">
          {columns.map((column, columnIndex) => (
            <div className="visual-index-column" key={columnIndex}>
              {column.map((item, itemIndex) => (
                <Link className={`visual-index-card visual-index-card-${(columnIndex + itemIndex) % 6}`} to={`/work/${item.slug}`} key={item.slug}>
                  <img src={item.imageUrl} alt="" />
                  <h2>{item.title}</h2>
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
