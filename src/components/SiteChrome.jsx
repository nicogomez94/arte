import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="wordmark" to="/">andrea alkalay</Link>
        <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegación principal">
          <NavLink to="/" onClick={() => setOpen(false)}>inicio</NavLink>
          <NavLink to="/galeria" onClick={() => setOpen(false)}>galería</NavLink>
          <NavLink to="/acerca-de-mi" onClick={() => setOpen(false)}>acerca de mí</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>contacto</NavLink>
        </nav>
        <div className="header-actions">
          <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
          <button className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Abrir menú">
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <span className="footer-name">Andrea Alkalay</span>
          <p>Artista visual · fotografía expandida.<br />Buenos Aires, Argentina.</p>
        </div>
        <nav aria-label="Navegación secundaria">
          <Link to="/">Inicio</Link>
          <Link to="/galeria">Galería</Link>
          <Link to="/acerca-de-mi">Acerca de mí</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/admin">Panel de artista</Link>
        </nav>
        <div className="footer-contact">
          <a href="mailto:info@andrealkalay.com">info@andrealkalay.com</a>
          <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Andrea Alkalay</span>
        <span>Hecho por <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a></span>
      </div>
    </footer>
  );
}

export function Loading({ dark = false }) {
  return <div className={`loading ${dark ? 'loading-dark' : ''}`} role="status"><span /> Cargando archivo…</div>;
}
