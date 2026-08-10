import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

const messages = {
  en: {
    mainNavigation: 'Main navigation',
    menu: 'Menu',
    toggleWork: 'Toggle Work projects',
    toggleExhibitions: 'Toggle Exhibitions',
    soloShow: 'Solo Show',
    groupShow: 'Group Show',
    languageSelector: 'Language selector. English is currently active',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    madeBy: 'Made by',
    loadingArchive: 'Loading archive…',
    previousArtwork: 'Previous artwork',
    nextArtwork: 'Next artwork',
    artworkSlideshow: 'Artwork slideshow',
    statement: 'Statement',
    projectFallback: 'A focused selection from the project archive.',
    aboutExhibition: 'About the exhibition',
    exhibitionFallback: 'Selected exhibition documentation from the archive.',
    noImages: 'No images available.',
    workIndex: 'Work index',
    exhibitionsIndex: 'Exhibitions index',
    projectImages: 'images',
    slideshow: 'slideshow',
    homeHero: 'Andrea Alkalay exhibition view',
    homeHeroAlt: 'Andrea Alkalay exhibition installation',
    openExhibitionsSlideshow: 'Open exhibitions slideshow',
    exhibitionView: 'Exhibition view',
    exhibitions: 'Exhibitions',
    galleryIntro: 'Installation views, visual research and exhibition fragments gathered as a quiet index of the work in space. This archive follows how each project changes when it meets a room, a route, a wall or an outdoor landscape. The images are not only records of display; they show scale, distance, light and the relation between works. Together they trace how the practice expands beyond the individual piece and becomes a spatial experience.',
    startViewing: 'Start viewing',
    noPublishedWorks: 'No works published yet.',
    biography: 'Andrea Alkalay CV',
    biographyDetails: 'CV details'
  },
  es: {
    mainNavigation: 'Navegación principal',
    menu: 'Menú',
    toggleWork: 'Mostrar u ocultar los proyectos de Obra',
    toggleExhibitions: 'Mostrar u ocultar las exposiciones',
    soloShow: 'Exposición individual',
    groupShow: 'Exposición colectiva',
    languageSelector: 'Selector de idioma. Español está activo',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    madeBy: 'Hecho por',
    loadingArchive: 'Cargando archivo…',
    previousArtwork: 'Obra anterior',
    nextArtwork: 'Obra siguiente',
    artworkSlideshow: 'Presentación de obras',
    statement: 'Statement',
    projectFallback: 'Una selección del archivo del proyecto.',
    aboutExhibition: 'Sobre la exposición',
    exhibitionFallback: 'Documentación seleccionada del archivo de la exposición.',
    noImages: 'No hay imágenes disponibles.',
    workIndex: 'Índice de obra',
    exhibitionsIndex: 'Índice de exposiciones',
    projectImages: 'imágenes',
    slideshow: 'presentación',
    homeHero: 'Vista de exposición de Andrea Alkalay',
    homeHeroAlt: 'Instalación de Andrea Alkalay en exposición',
    openExhibitionsSlideshow: 'Abrir la presentación de exposiciones',
    exhibitionView: 'Vista de exposición',
    exhibitions: 'Exposiciones',
    galleryIntro: 'Vistas de instalación, investigación visual y fragmentos de exposiciones reunidos como un índice sereno de la obra en el espacio. Este archivo sigue cómo cambia cada proyecto al encontrarse con una sala, un recorrido, una pared o un paisaje exterior. Las imágenes no son solo registros del montaje: muestran la escala, la distancia, la luz y la relación entre las obras. En conjunto, trazan cómo la práctica se expande más allá de la pieza individual y se convierte en una experiencia espacial.',
    startViewing: 'Comenzar recorrido',
    noPublishedWorks: 'Todavía no hay obras publicadas.',
    biography: 'CV de Andrea Alkalay',
    biographyDetails: 'Detalles del CV'
  }
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: key => messages.en[key] || key
});

export function LanguageProvider({ children }) {
  // English intentionally remains the base language after every full page load.
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    document.documentElement.lang = language;
    const description = document.querySelector('meta[name="description"]');
    document.title = language === 'es'
      ? 'Andrea Alkalay · Artista visual'
      : 'Andrea Alkalay · Visual artist';
    if (description) {
      description.content = language === 'es'
        ? 'Andrea Alkalay — artista visual. Fotografía expandida, materia, paisaje y territorio.'
        : 'Andrea Alkalay — visual artist. Expanded photography, matter, landscape and territory.';
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(current => current === 'en' ? 'es' : 'en'),
    t: key => messages[language][key] || messages.en[key] || key
  }), [language]);

  return createElement(LanguageContext.Provider, { value }, children);
}

export const useLanguage = () => useContext(LanguageContext);
