import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { projects } from '../projects';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="wordmark" to="/">
          <span>andrea alkalay</span>
          <small>Art Photography</small>
        </Link>
        <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          <div className="work-menu">
            <NavLink className={pathname.startsWith('/work/') ? 'active' : ''} to="/work/unfixed-landscapes" aria-haspopup="true">work</NavLink>
            <div className="work-dropdown">
              <div className="work-dropdown-inner">
                {projects.map(project => (
                  <Link key={project.slug} to={`/work/${project.slug}`} onClick={() => setOpen(false)}>{project.title}</Link>
                ))}
              </div>
            </div>
          </div>
          <NavLink to="/exhibitions" onClick={() => setOpen(false)}>exhibitions</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>contact</NavLink>
        </nav>
        <div className="header-actions">
          <button className="language-toggle" type="button" aria-label="Language selector. English is currently active" aria-disabled="true">
            <span className="is-active">EN</span><span>/</span><span>ES</span>
          </button>
          <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
          <button className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Open menu">
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
          <p>Visual artist · expanded photography.<br />Buenos Aires, Argentina.</p>
        </div>
        <nav aria-label="Secondary navigation">
          <Link to="/">Home</Link>
          <Link to="/work/unfixed-landscapes">Work</Link>
          <Link to="/exhibitions">Exhibitions</Link>
          <Link to="/contacto">Contact</Link>
          <Link to="/admin">Artist panel</Link>
        </nav>
        <div className="footer-contact">
          <a href="mailto:info@andrealkalay.com">info@andrealkalay.com</a>
          <a href="https://instagram.com/andrealkalay" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Andrea Alkalay</span>
        <span>Made by <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a></span>
      </div>
    </footer>
  );
}

export function Loading({ dark = false }) {
  return <div className={`loading ${dark ? 'loading-dark' : ''}`} role="status"><span /> Loading archive…</div>;
}
