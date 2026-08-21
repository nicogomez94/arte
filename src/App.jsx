import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cv = lazy(() => import('./pages/Cv'));
const ExhibitionProject = lazy(() => import('./pages/ExhibitionProject'));
const ExhibitionsIndex = lazy(() => import('./pages/ExhibitionsIndex'));
const WorkIndex = lazy(() => import('./pages/WorkIndex'));
const WorkProject = lazy(() => import('./pages/WorkProject'));
const Statement = lazy(() => import('./pages/Statement'));
const Workshops = lazy(() => import('./pages/Workshops'));
import Seo from './components/Seo';
import { LanguageProvider } from './i18n';
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
    <LanguageProvider>
      <SiteContentProvider>
        <Seo />
        <ScrollToTop />
        <Suspense fallback={<div className="loading" role="status"><span /></div>}>
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
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SiteContentProvider>
    </LanguageProvider>
  );
}
