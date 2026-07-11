import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Cv from './pages/Cv';
import ExhibitionProject from './pages/ExhibitionProject';
import ExhibitionsIndex from './pages/ExhibitionsIndex';
import WorkIndex from './pages/WorkIndex';
import WorkProject from './pages/WorkProject';
import Statement from './pages/Statement';
import { SiteContentProvider } from './siteContent';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <SiteContentProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<Navigate to="/exhibitions" replace />} />
        <Route path="/exhibitions" element={<ExhibitionsIndex />} />
        <Route path="/exhibitions/:slug" element={<ExhibitionProject />} />
        <Route path="/work" element={<WorkIndex />} />
        <Route path="/work/:slug" element={<WorkProject />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/acerca-de-mi" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/cv" element={<Cv />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteContentProvider>
  );
}
