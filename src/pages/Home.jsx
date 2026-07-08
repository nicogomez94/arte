import { useEffect, useState } from 'react';
import { api } from '../api';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Header } from '../components/SiteChrome';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  useEffect(() => {
    api.artworks().then(setArtworks).catch(() => setArtworks([]));
  }, []);

  const heroSlides = artworks.length ? artworks : [{
    id: 'home-hero',
    imageUrl: '/exhibicion-01.png',
    alt: 'Andrea Alkalay installation at Soulangh Cultural Park',
    title: 'Unfixed Landscapes',
    series: 'Soulangh Cultural Park, Taiwan',
    year: '2026',
    technique: 'Art photography'
  }];

  return (
    <div className="site-page home-page">
      <Header />
      <main>
        <section className="home-hero" aria-label="Andrea Alkalay exhibition">
          <figure className="hero-image reveal">
            <button className="hero-image-button" type="button" onClick={() => setSlideshowOpen(true)} aria-label="Open homepage slideshow">
              <img src="/exhibicion-01.png" alt="Andrea Alkalay installation at Soulangh Cultural Park" />
            </button>
            <figcaption>Unfixed Landscapes · Soulangh Cultural Park, Taiwan · 2026</figcaption>
          </figure>
          {/* <a className="hero-scroll-cue" href="#portfolio" aria-label="Scroll to work">↓</a> */}
        </section>
      </main>
      <FullscreenSlideshow artworks={heroSlides} open={slideshowOpen} initialIndex={0} onClose={() => setSlideshowOpen(false)} label="Homepage slideshow" />
    </div>
  );
}
