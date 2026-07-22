import { useEffect } from 'react';
import { Header } from '../components/SiteChrome';

export default function Home() {
  useEffect(() => {
    document.body.classList.add('home-screen-active');
    return () => document.body.classList.remove('home-screen-active');
  }, []);

  return (
    <div className="site-page home-page">
      <Header />
      <main className="home-main">
        <section className="home-hero" aria-label="Andrea Alkalay exhibition view">
          <img src="/esta.jpg" alt="Andrea Alkalay exhibition installation" />
        </section>
      </main>
    </div>
  );
}
