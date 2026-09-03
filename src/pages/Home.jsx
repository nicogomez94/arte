import { useEffect } from 'react';
import { Header } from '../components/SiteChrome';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export default function Home() {
  const { language, t } = useLanguage();
  const home = useSiteContent('home');
  const usesDefaultHero = home.heroImageUrl === '/esta.jpg';

  useEffect(() => {
    document.body.classList.add('home-screen-active');
    return () => document.body.classList.remove('home-screen-active');
  }, []);

  return (
    <div className="site-page home-page">
      <Header />
      <main className="home-main">
        <h1 className="visually-hidden">
          Andrea Alkalay · {language === 'es' ? 'Artista visual' : 'Visual artist'}
        </h1>
        <section className="home-hero" aria-label={t('homeHero')}>
          <img
            src={home.heroImageUrl}
            srcSet={usesDefaultHero ? '/optimized/andrea-alkalay-unfixed-landscapes-960.webp 960w, /optimized/andrea-alkalay-unfixed-landscapes-1600.webp 1600w, /esta.jpg 2676w' : undefined}
            sizes="100vw"
            width={usesDefaultHero ? 2676 : undefined}
            height={usesDefaultHero ? 1490 : undefined}
            alt={home.heroImageAlt || t('homeHeroAlt')}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </section>
      </main>
    </div>
  );
}
