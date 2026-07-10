import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSiteContent } from '../siteContent';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const global = useSiteContent('global');
  const { projects } = useSiteContent('work');
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');

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
          <span>{global.artistName}</span>
          <small>{global.artistDiscipline}</small>
        </Link>
        <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          <div className="work-menu">
            <NavLink className={pathname.startsWith('/work') ? 'active' : ''} to="/work" aria-haspopup="true">{global.workMenuLabel}</NavLink>
            <div className="work-dropdown">
              <div className="work-dropdown-inner">
                {projects.map((project, index) => (
                  <Link
                    className={index > 1 ? 'is-muted-link' : undefined}
                    key={project.slug}
                    to={index > 1 ? '/work/unfixed-landscapes' : `/work/${project.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="work-menu exhibitions-menu">
            <NavLink className={pathname.startsWith('/exhibitions') ? 'active' : ''} to="/exhibitions" aria-haspopup="true">{global.exhibitionsMenuLabel}</NavLink>
            <div className="work-dropdown">
              <div className="work-dropdown-inner">
                {exhibitionProjects.map((project, index) => (
                  <Link
                    className={index > 1 ? 'is-muted-link' : undefined}
                    key={project.slug}
                    to={index > 1 ? '/exhibitions/recoleta-cultural-center' : `/exhibitions/${project.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <NavLink to="/statement" onClick={() => setOpen(false)}>{global.statementMenuLabel}</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>{global.contactMenuLabel}</NavLink>
          <NavLink to="/cv" onClick={() => setOpen(false)}>{global.cvMenuLabel}</NavLink>
        </nav>
        <div className="header-actions">
          <button className="language-toggle" type="button" aria-label="Language selector. English is currently active" aria-disabled="true">
            <span className="is-active">EN</span><span>/</span><span>ES</span>
          </button>
          <a className="instagram-link" href={global.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg className="fa-instagram-icon" viewBox="0 0 448 512" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9S352.4 35.1 316.5 33.4c-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S3.2 127.5 1.5 163.4c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.5 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
          </a>
          <button className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Open menu">
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const global = useSiteContent('global');
  return (
    <footer className="site-footer">
      <span>
        {global.footerText} · Hecho por{' '}
        <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a>
      </span>
    </footer>
  );
}

export function Loading({ dark = false }) {
  return <div className={`loading ${dark ? 'loading-dark' : ''}`} role="status"><span /> Loading archive…</div>;
}
