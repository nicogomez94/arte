import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { useSiteContent } from '../siteContent';

export function Header() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [desktopSection, setDesktopSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const global = useSiteContent('global');
  const { projects } = useSiteContent('work');
  const { projects: exhibitionProjects } = useSiteContent('exhibitions');
  const { language, toggleLanguage, t } = useLanguage();
  const exhibitionGroups = [
    { key: 'solo', label: t('soloShow') },
    { key: 'group', label: t('groupShow') }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenSection(null);
    setDesktopSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', open);

    const closeOnEscape = event => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('mobile-menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const toggleSection = section => {
    setOpenSection(current => current === section ? null : section);
  };

  const desktopMenuProps = section => ({
    onMouseEnter: () => setDesktopSection(section),
    onMouseLeave: () => setDesktopSection(null),
    onFocus: () => setDesktopSection(section),
    onBlur: event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setDesktopSection(null);
    }
  });

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="wordmark" to="/">
          <span>{global.artistName}</span>
        </Link>
        <nav id="main-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label={t('mainNavigation')}>
          <div className="mobile-nav-heading" aria-hidden="true">
            <span>{t('menu')}</span>
          </div>
          <div
            className={`work-menu ${openSection === 'work' ? 'is-mobile-expanded' : ''} ${desktopSection === 'work' ? 'is-desktop-open' : ''}`}
            {...desktopMenuProps('work')}
          >
            <div className="nav-section-heading">
              <NavLink className={pathname.startsWith('/work') ? 'active' : ''} to="/work/unfixed-landscapes" aria-haspopup="true">{global.workMenuLabel}</NavLink>
              <button className="mobile-submenu-toggle" type="button" onClick={() => toggleSection('work')} aria-expanded={openSection === 'work'} aria-controls="work-navigation-list" aria-label={t('toggleWork')}>
                <span />
              </button>
            </div>
            <div id="work-navigation-list" className="work-dropdown">
              <div className="work-dropdown-inner">
                {projects.map(project => (
                  <Link
                    key={project.slug}
                    to={`/work/${project.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`work-menu exhibitions-menu ${openSection === 'exhibitions' ? 'is-mobile-expanded' : ''} ${desktopSection === 'exhibitions' ? 'is-desktop-open' : ''}`}
            {...desktopMenuProps('exhibitions')}
          >
            <div className="nav-section-heading">
              <NavLink className={pathname.startsWith('/exhibitions') ? 'active' : ''} to="/exhibitions" aria-haspopup="true">{global.exhibitionsMenuLabel}</NavLink>
              <button className="mobile-submenu-toggle" type="button" onClick={() => toggleSection('exhibitions')} aria-expanded={openSection === 'exhibitions'} aria-controls="exhibitions-navigation-list" aria-label={t('toggleExhibitions')}>
                <span />
              </button>
            </div>
            <div id="exhibitions-navigation-list" className="work-dropdown">
              <div className="work-dropdown-inner exhibition-dropdown-inner">
                {exhibitionGroups.map(group => (
                  <details className="exhibition-dropdown-group" key={group.key}>
                    <summary>
                      <span>{group.label}</span>
                      <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg>
                    </summary>
                    <div>
                      {exhibitionProjects.filter(project => project.category === group.key).map(project => (
                        <Link key={project.slug} to={`/exhibitions/${project.slug}`} onClick={() => setOpen(false)}>{project.title}</Link>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
          <NavLink to="/statement" onClick={() => setOpen(false)}>{global.statementMenuLabel}</NavLink>
          <NavLink to="/cv" onClick={() => setOpen(false)}>{global.cvMenuLabel}</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>{global.contactMenuLabel}</NavLink>
          <div className="mobile-nav-foot" aria-hidden="true">
            <span>Buenos Aires</span>
          </div>
        </nav>
        <div className="header-actions">
          <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={t('languageSelector')}>
            <span className={language === 'en' ? 'is-active' : undefined}>EN</span>
            <span>/</span>
            <span className={language === 'es' ? 'is-active' : undefined}>ES</span>
          </button>
          <div className="header-social-links" aria-label="Social media">
            <a href={global.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 448 512" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9S352.4 35.1 316.5 33.4c-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S3.2 127.5 1.5 163.4c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.5 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
            <a href={global.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 320 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>
            </a>
            <a href={global.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zm-46.49-340C24.09 108 0 83.5 0 53.8A53.79 53.79 0 0 1 107.58 53.8c0 29.7-24.1 54.2-53.79 54.2zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" /></svg>
            </a>
          </div>
          <button className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? t('closeMenu') : t('openMenu')}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const global = useSiteContent('global');
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <span>{global.footerText}</span>
      <span className="site-footer-credit">
        {t('madeBy')}{' '}
        <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a>
      </span>
    </footer>
  );
}

export function Loading({ dark = false }) {
  const { t } = useLanguage();
  return <div className={`loading ${dark ? 'loading-dark' : ''}`} role="status"><span /> {t('loadingArchive')}</div>;
}
