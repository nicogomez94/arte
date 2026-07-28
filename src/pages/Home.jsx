import { useEffect } from 'react';
import { Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';

export default function Home() {
  const { t } = useLanguage();

  useEffect(() => {
    document.body.classList.add('home-screen-active');
    return () => document.body.classList.remove('home-screen-active');
  }, []);

  return (
    <div className="site-page home-page">
      <Header />
      <main className="home-main">
        <section className="home-hero" aria-label={t('homeHero')}>
          <img src="/esta.jpg" alt={t('homeHeroAlt')} />
        </section>
      </main>
    </div>
  );
}
