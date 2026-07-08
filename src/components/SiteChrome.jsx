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
            <NavLink className={pathname.startsWith('/work/') ? 'active' : ''} to="/work/unfixed-landscapes" aria-haspopup="true">Work</NavLink>
            <div className="work-dropdown">
              <div className="work-dropdown-inner">
                {projects.map(project => (
                  <Link key={project.slug} to={`/work/${project.slug}`} onClick={() => setOpen(false)}>{project.title}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="work-menu exhibitions-menu">
            <NavLink className={pathname.startsWith('/exhibitions') ? 'active' : ''} to="/exhibitions" aria-haspopup="true">Exhibitions</NavLink>
            <div className="work-dropdown">
              <div className="work-dropdown-inner">
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Recoleta Cultural Center</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Espacio DAR / Tucuman</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Park Pecno Slovenia</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Museo Bellas Artes Frankling Rawson</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>OdA Arte. Art FAirs</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Mundo Nuevo Gallery Art</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Centro Cultural Mapocho CHILE</Link>
                <Link to="/exhibitions#selected" onClick={() => setOpen(false)}>Mundo Nuevo/ Kutho/Group show</Link>
              </div>
            </div>
          </div>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>Contact</NavLink>
          <NavLink to="/cv" onClick={() => setOpen(false)}>CV</NavLink>
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
      <span>andrea alkalay | 2026</span>
    </footer>
  );
}

export function Loading({ dark = false }) {
  return <div className={`loading ${dark ? 'loading-dark' : ''}`} role="status"><span /> Loading archive…</div>;
}
