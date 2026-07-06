import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import WorkProject from './pages/WorkProject';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galeria" element={<Navigate to="/exhibitions" replace />} />
        <Route path="/exhibitions" element={<Gallery />} />
        <Route path="/work/:slug" element={<WorkProject />} />
        <Route path="/acerca-de-mi" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
