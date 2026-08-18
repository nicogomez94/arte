import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { toMasonryColumns } from '../projectNavigation';
import { useSiteContent } from '../siteContent';

export default function WorkIndex() {
  const { projects } = useSiteContent('work');
  const { t } = useLanguage();
  const columns = toMasonryColumns(projects);

  return (
    <div className="site-page index-page">
      <Header />
      <main className="visual-index-main" aria-label={t('workIndex')}>
        <div className="visual-index-grid">
          {columns.map((column, columnIndex) => (
            <div className="visual-index-column" key={columnIndex}>
              {column.map(({ item, sourceIndex }, itemIndex) => (
                <Link className={`visual-index-card visual-index-card-${(columnIndex + itemIndex) % 6}`} style={{ '--mobile-order': sourceIndex }} to={`/work/${item.slug}`} key={item.slug}>
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
