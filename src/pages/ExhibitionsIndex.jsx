import { Link } from 'react-router-dom';
import { Footer, Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { toMasonryColumns } from '../projectNavigation';
import { useSiteContent } from '../siteContent';

export default function ExhibitionsIndex() {
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const { t } = useLanguage();
  const groups = [
    { key: 'solo', title: t('soloShow') },
    { key: 'group', title: t('groupShow') }
  ];

  return (
    <div className="site-page index-page">
      <Header />
      <main className="visual-index-main" aria-label={t('exhibitionsIndex')}>
        <h1 className="visually-hidden">{t('exhibitionsIndex')} · Andrea Alkalay</h1>
        {groups.map(group => {
          const items = exhibitionProjects.filter(project => project.category === group.key);
          const columns = toMasonryColumns(items);
          return (
            <section className="exhibition-index-section" id={`${group.key}-show`} key={group.key} aria-labelledby={`${group.key}-show-title`}>
              <h2 id={`${group.key}-show-title`}>{group.title}</h2>
              <div className="visual-index-grid">
                {columns.map((column, columnIndex) => (
                  <div className="visual-index-column" key={columnIndex}>
                    {column.map(({ item, sourceIndex }, itemIndex) => (
                      <Link className={`visual-index-card visual-index-card-${(columnIndex + itemIndex) % 6}`} style={{ '--mobile-order': sourceIndex }} to={`/exhibitions/${item.slug}`} key={item.slug}>
                        <img
                          src={item.imageUrl}
                          alt={`${item.title} · Andrea Alkalay`}
                          loading={sourceIndex < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                          fetchPriority={sourceIndex === 0 && group.key === 'solo' ? 'high' : 'auto'}
                        />
                        <h3>{item.title}</h3>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
