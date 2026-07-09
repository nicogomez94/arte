import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import FullscreenSlideshow from '../components/FullscreenSlideshow';
import { Footer, Header } from '../components/SiteChrome';
import { exhibitionProjects, getExhibitionSlides } from '../projectAssets';

export default function ExhibitionProject() {
  const { slug } = useParams();
  const project = exhibitionProjects.find(item => item.slug === slug);
  const slides = getExhibitionSlides(slug);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!project) return <Navigate to="/exhibitions" replace />;
  const coverSlide = slides[0];

  return (
    <div className="site-page gallery-page">
      <Header />
      <main>
        <section className="editorial-intro gallery-landing">
          <button
            className="editorial-intro-image image-open-button"
            type="button"
            onClick={() => { setStartIndex(0); setOpen(true); }}
            disabled={!slides.length}
            aria-label={`Open ${project.title} slideshow`}
          >
            <img src={project.imageUrl || coverSlide?.imageUrl} alt={coverSlide?.alt || project.title} />
          </button>
          <div className="editorial-intro-copy">
            <h3>{project.title}</h3>
            <p>{project.year}</p>
            <button className="tour-button" type="button" onClick={() => { setStartIndex(0); setOpen(true); }} disabled={!slides.length}>
              <span>Start viewing</span><b>→</b>
            </button>
          </div>
        </section>

        <section className="gallery-archive" id="selected">
          <div className="artwork-thumb-grid">
            {slides.map((artwork, index) => (
              <button type="button" key={artwork.id} onClick={() => { setStartIndex(index); setOpen(true); }} className="artwork-thumb">
                <img src={artwork.imageUrl} alt="" />
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FullscreenSlideshow artworks={slides} open={open} initialIndex={startIndex} onClose={() => setOpen(false)} label={`${project.title} slideshow`} />
    </div>
  );
}
