import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { cvItemsToRichText, plainTextToCvHtml, safeCvHref, sanitizeCvRichText } from '../cvItems';
import { mediaTypeFor, mediaValidationError, youtubeMediaFromUrl } from '../mediaContent';
import { defaultSiteContent, mergeSiteContent, SITE_CONTENT_UPDATED_EVENT } from '../siteContent';
import { NAVIGATION_ITEMS, normalizeNavigationOrder } from '../navigation';
import { translateCvRichText } from '../translations';

const sections = [
  { key: 'global', label: 'Navegación', route: '/' },
  { key: 'home', label: 'Home', route: '/' },
  { key: 'work', label: 'Work', route: '/work' },
  { key: 'exhibitions', label: 'Exhibitions', route: '/exhibitions' },
  { key: 'statement', label: 'Statement', route: '/statement' },
  { key: 'cv', label: 'CV', route: '/cv' },
  { key: 'workshops', label: 'Workshops', route: '/workshops' },
  { key: 'contact', label: 'Contact', route: '/contacto' }
];

const labels = {
  artistName: 'Nombre de la artista', artistDiscipline: 'Disciplina', workMenuLabel: 'Work · Inglés',
  exhibitionsMenuLabel: 'Exhibitions · Inglés', statementMenuLabel: 'Statement · Inglés',
  contactMenuLabel: 'Contact · Inglés', cvMenuLabel: 'CV · Inglés', workshopsMenuLabel: 'Workshops · Inglés',
  workMenuLabelEs: 'Obra · Español', exhibitionsMenuLabelEs: 'Exhibiciones · Español',
  statementMenuLabelEs: 'Statement · Español', contactMenuLabelEs: 'Contacto · Español',
  cvMenuLabelEs: 'CV · Español', workshopsMenuLabelEs: 'Talleres · Español', instagramUrl: 'Enlace de Instagram',
  footerText: 'Texto del pie', heroImageUrl: 'Imagen principal', heroImageAlt: 'Descripción de la imagen principal',
  startViewingLabel: 'Texto de iniciar recorrido', expandLabel: 'Texto de expandir', showLessLabel: 'Texto de contraer',
  pauseLabel: 'Texto de pausa', playLabel: 'Texto de reproducción', closeLabel: 'Texto de cerrar', noImagesLabel: 'Mensaje sin imágenes',
  heroCaption: 'Epígrafe', selectedWorkLabel: 'Título de la sección', viewWorkLabel: 'Texto del botón',
  viewMoreLabel: 'Texto de ver más', projects: 'Proyectos', title: 'Título · Inglés', year: 'Año', imageUrl: 'Imagen',
  alt: 'Descripción de imagen', intro: 'Statement · Inglés', introEs: 'Statement · Español',
  images: 'Galería de imágenes', series: 'Serie', technique: 'Técnica', description: 'Descripción',
  gridImages: 'Imágenes de la grilla', paragraphs: 'Statement · Inglés', paragraphsEs: 'Statement · Español',
  eyebrow: 'Etiqueta superior', nameFirstLine: 'Primera línea del nombre',
  nameSecondLine: 'Segunda línea del nombre', role: 'Descripción profesional', portraitImageUrl: 'Retrato',
  portraitImageAlt: 'Descripción del retrato', practiceLabel: 'Etiqueta de práctica', practiceTitle: 'Título de práctica',
  practiceParagraphs: 'Textos de práctica', detailImageUrl: 'Imagen de detalle', detailImageAlt: 'Descripción de imagen de detalle',
  detailCaption: 'Epígrafe de detalle', detailLabel: 'Etiqueta de detalle', detailTitle: 'Título de detalle',
  facts: 'Datos', label: 'Etiqueta', value: 'Texto visible', linkLabel: 'Texto del enlace', imageAlt: 'Descripción de imagen',
  subtitle: 'Bajada', links: 'Enlaces', url: 'Destino del enlace', introLabel: 'Título de introducción',
  sections: 'Secciones de CV', items: 'Entradas', href: 'Destino del enlace (href)', category: 'Categoría',
  rows: 'Filas', text: 'Texto · Inglés', textEs: 'Texto · Español', titleEs: 'Título · Español',
  imageAltEs: 'Descripción de imagen · Español'
};

const hiddenKeys = new Set(['slug', 'id', 'category', 'slideIndex', 'mediaType', 'embedUrl', 'posterUrl', 'published', 'position', 'createdAt', 'updatedAt', 'contentVersion', 'statementVersion', 'menuLabelsVersion', 'menuOrder']);
const imageKeys = new Set(['imageUrl', 'heroImageUrl', 'portraitImageUrl', 'detailImageUrl']);
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const clone = value => JSON.parse(JSON.stringify(value));
const titleForItem = (item, index) => item.title || item.label || item.value || `Elemento ${index + 1}`;
const thumbnailForItem = item => mediaTypeFor(item) === 'image' ? item.imageUrl : (item.posterUrl || item.imageUrl);
const uniqueId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const MediaProcessingContext = createContext(() => {});

const useMediaProcessing = () => {
  const reportProcessing = useContext(MediaProcessingContext);
  const token = useRef(Symbol('media-processing'));
  const processing = useRef(false);
  const setProcessing = useCallback(next => {
    if (processing.current === next) return;
    processing.current = next;
    reportProcessing(token.current, next);
  }, [reportProcessing]);

  useEffect(() => () => {
    if (processing.current) reportProcessing(token.current, false);
  }, [reportProcessing]);

  return setProcessing;
};

const imageFromFile = file => new Promise((resolve, reject) => {
  if (!file.type.startsWith('image/')) return reject(new Error('Elegí un archivo de imagen.'));
  if (file.size > 12 * 1024 * 1024) return reject(new Error('La imagen supera los 12 MB.'));
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('No pudimos leer la imagen.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('El archivo no parece ser una imagen válida.'));
    image.onload = () => {
      const max = 1800;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/webp', 0.84));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

const posterFromVideo = file => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  let settled = false;
  const finish = callback => {
    if (settled) return;
    settled = true;
    URL.revokeObjectURL(url);
    callback();
  };
  const capture = () => {
    try {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      finish(() => resolve(canvas.toDataURL('image/webp', 0.82)));
    } catch {
      finish(() => reject(new Error('No pudimos generar la miniatura del video.')));
    }
  };
  video.onerror = () => finish(() => reject(new Error('El archivo no parece ser un video válido.')));
  video.onloadeddata = () => {
    if (Number.isFinite(video.duration) && video.duration > 0.2) {
      video.onseeked = capture;
      video.currentTime = Math.min(0.25, video.duration / 2);
    } else capture();
  };
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = url;
  video.load();
});

function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try { await api.login(password); await onSuccess(); }
    catch (loginError) { setError(loginError.message); }
    finally { setBusy(false); }
  };
  return (
    <main className="admin-login">
      <section>
        <Link to="/" className="admin-login-brand">andrea alkalay</Link>
        {/* <span className="eyebrow">Panel de contenido</span> */}
        <h2>Panel Autoadministrable</h2>
        <p>Ingresá tu contraseña para actualizar los textos y las imágenes de cada página.</p>
        <form onSubmit={submit}>
          <label htmlFor="admin-password">Contraseña</label>
          <div><input id="admin-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required autoFocus /><button disabled={busy}>{busy ? 'Entrando…' : 'Entrar →'}</button></div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        <small>Acceso privado · sesión protegida</small>
      </section>
      <figure><img src="/exhibicion-02.png" alt="Detalle de obra en exhibición" /><figcaption>Gestión de contenido · AA</figcaption></figure>
    </main>
  );
}

function ImageField({ label, value, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const setProcessing = useMediaProcessing();
  const choose = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setProcessing(true);
    try { onChange(await imageFromFile(file)); }
    catch (error) { window.alert(error.message); }
    finally { setBusy(false); setProcessing(false); event.target.value = ''; }
  };
  return (
    <div className="admin-content-image-field">
      <span>{label}</span>
      <button type="button" onClick={() => input.current?.click()} disabled={busy}>
        {value ? <img src={value} alt="" /> : <span className="admin-image-placeholder">Sin imagen</span>}
        <em>{busy ? 'Preparando…' : 'Cambiar imagen'}</em>
      </button>
      <input ref={input} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={choose} />
    </div>
  );
}

function VideoField({ item, path, onChange }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const setProcessing = useMediaProcessing();
  const choose = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      window.alert('Elegí un video MP4 o WebM.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      window.alert('El video supera los 50 MB.');
      event.target.value = '';
      return;
    }
    setBusy(true); setProcessing(true);
    try {
      const poster = await posterFromVideo(file);
      const uploaded = await api.uploadVideo(file);
      onChange(path, {
        ...item,
        mediaType: 'video',
        imageUrl: uploaded.url,
        posterUrl: poster,
        title: item.title === 'Nuevo video' ? file.name.replace(/\.[^.]+$/, '') : item.title
      });
    } catch (error) { window.alert(error.message); }
    finally { setBusy(false); setProcessing(false); event.target.value = ''; }
  };
  return (
    <section className="admin-media-source">
      <div className="admin-media-source-heading"><span>Archivo de video</span><small>MP4 o WebM · máximo 50 MB</small></div>
      {item.imageUrl ? <video src={item.imageUrl} poster={item.posterUrl} controls preload="metadata" /> : <div className="admin-video-placeholder">Todavía no subiste un archivo.</div>}
      <button className="admin-media-upload" type="button" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Subiendo y preparando…' : item.imageUrl ? 'Reemplazar video' : 'Seleccionar video'}</button>
      <input ref={input} className="visually-hidden" type="file" accept="video/mp4,video/webm" onChange={choose} />
      <ImageField label="Miniatura del video" value={item.posterUrl} onChange={posterUrl => onChange(path, { ...item, posterUrl })} />
    </section>
  );
}

function YouTubeField({ item, path, onChange }) {
  const [url, setUrl] = useState(item.embedUrl || '');
  const apply = () => {
    const next = youtubeMediaFromUrl(url, item);
    if (!next) return window.alert('Ingresá un enlace válido de YouTube.');
    onChange(path, next);
  };
  return (
    <section className="admin-media-source">
      <div className="admin-media-source-heading"><span>Video de YouTube</span><small>Admite enlaces watch, youtu.be, Shorts y embed.</small></div>
      {item.embedUrl && <div className="admin-youtube-preview"><img src={item.posterUrl || item.imageUrl} alt="" /><span>▶</span></div>}
      <div className="admin-youtube-input"><input type="url" value={url} placeholder="https://www.youtube.com/watch?v=…" onChange={event => setUrl(event.target.value)} /><button type="button" onClick={apply}>Aplicar enlace</button></div>
    </section>
  );
}

function ProjectCovers({ projects, onChange, category = null }) {
  const visibleProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => !category || project.category === category);
  return (
    <section className="admin-project-covers">
      <header><h3>Portadas de la grilla</h3><p>Estas imágenes aparecen en el índice masonry de la sección.</p></header>
      <div className="admin-cover-group">
        <div>
          {visibleProjects.map(({ project, index }) => (
            <article key={project.slug || index}>
              <ImageField label={project.title} value={project.imageUrl} onChange={value => onChange(['projects', index, 'imageUrl'], value)} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaItemFields({ item, path, onChange, isExhibition = false }) {
  const type = mediaTypeFor(item);
  return (
    <div className="admin-media-editor">
      <header className="admin-editor-subheading"><span>Fuente</span><b>{type === 'image' ? 'Imagen' : type === 'video' ? 'Video' : 'YouTube'}</b></header>
      {isExhibition ? (
        <>
          <label className="admin-content-field admin-media-title-field">
            <span>Texto al pie · Inglés</span>
            <input type="text" value={item.title || ''} onChange={event => onChange([...path, 'title'], event.target.value)} />
          </label>
          <label className="admin-content-field admin-media-title-field">
            <span>Texto al pie · Español</span>
            <input type="text" value={item.titleEs || ''} onChange={event => onChange([...path, 'titleEs'], event.target.value)} />
            <small>Se muestra debajo de la imagen y en la galería ampliada.</small>
          </label>
        </>
      ) : (
        <label className="admin-content-field admin-media-title-field">
          <span>Título</span>
          <input type="text" value={item.title || ''} onChange={event => onChange([...path, 'title'], event.target.value)} />
        </label>
      )}
      {type === 'image' && <ImageField label="Imagen" value={item.imageUrl} onChange={imageUrl => onChange(path, { ...item, mediaType: 'image', imageUrl })} />}
      {type === 'video' && <VideoField item={item} path={path} onChange={onChange} />}
      {type === 'youtube' && <YouTubeField item={item} path={path} onChange={onChange} />}
    </div>
  );
}

function ProjectFields({ project, path, onChange, onMove, onAdd, onRemove, projectCategory }) {
  const isExhibition = Boolean(projectCategory);
  return (
    <div className="admin-project-editor">
      <section className="admin-field-section">
        <header><h4>Datos del proyecto</h4><p>Información principal que identifica esta entrada.</p></header>
        <div className="admin-content-fields">
          <label className="admin-content-field field-wide"><span>{isExhibition ? 'Título · Inglés' : 'Título'}</span><input type="text" value={project.title || ''} onChange={event => onChange([...path, 'title'], event.target.value)} /></label>
          {isExhibition ? (
            <label className="admin-content-field field-wide"><span>Título · Español</span><input type="text" value={project.titleEs || ''} onChange={event => onChange([...path, 'titleEs'], event.target.value)} /></label>
          ) : null}
        </div>
      </section>
      <section className="admin-field-section">
        <header><h4>Textos</h4><p>Statement del proyecto en los dos idiomas del sitio.</p></header>
        <div className="admin-content-fields">
          <label className="admin-content-field field-wide"><span>Statement · Inglés</span><textarea rows="10" value={project.intro || ''} onChange={event => onChange([...path, 'intro'], event.target.value)} /></label>
          <label className="admin-content-field field-wide"><span>Statement · Español</span><textarea rows="10" value={project.introEs || ''} onChange={event => onChange([...path, 'introEs'], event.target.value)} /></label>
        </div>
      </section>
      <section className="admin-field-section admin-project-media-section">
        <header><h4>Contenido multimedia</h4><p>Una sola lista define tanto la grilla como el recorrido ampliado.</p></header>
        <ContentFields value={project.images || []} path={[...path, 'images']} onChange={onChange} onMove={onMove} onAdd={onAdd} onRemove={onRemove} projectCategory={projectCategory} />
      </section>
    </div>
  );
}

function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    const next = sanitizeCvRichText(value);
    if (editor.innerHTML !== next) editor.innerHTML = next;
  }, [value]);

  const emit = () => {
    const editor = editorRef.current;
    if (editor) onChange(sanitizeCvRichText(editor.innerHTML));
  };

  const format = (command, argument = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    emit();
  };

  const editLink = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount || !editor.contains(selection.anchorNode)) {
      window.alert('Seleccioná dentro del texto lo que querés enlazar.');
      return;
    }
    const selectedRange = selection.getRangeAt(0).cloneRange();
    const origin = selection.anchorNode.nodeType === Node.ELEMENT_NODE ? selection.anchorNode : selection.anchorNode.parentElement;
    const currentLink = origin?.closest?.('a');
    if (selection.isCollapsed && !currentLink) {
      window.alert('Seleccioná el texto que querés convertir en link.');
      return;
    }
    const entered = window.prompt('Pegá el destino del link. Dejalo vacío para quitarlo.', currentLink?.getAttribute('href') || 'https://');
    if (entered === null) return;
    editor.focus();
    selection.removeAllRanges();
    selection.addRange(selectedRange);
    if (!entered.trim()) {
      if (currentLink) currentLink.replaceWith(...currentLink.childNodes);
      else document.execCommand('unlink');
      emit();
      return;
    }
    const href = safeCvHref(entered);
    if (!href) {
      window.alert('Usá un link que empiece con https://, http://, mailto:, tel:, / o #.');
      return;
    }
    if (currentLink) currentLink.setAttribute('href', href);
    else document.execCommand('createLink', false, href);
    editor.querySelectorAll('a').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    emit();
  };

  return (
    <div className="admin-rich-text-field">
      <span>{label}</span>
      <div className="admin-rich-text-toolbar" aria-label={`Formato de ${label}`}>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format('formatBlock', 'p')}>Párrafo</button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format('bold')}><strong>N</strong></button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format('italic')}><em>C</em></button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format('insertUnorderedList')}>• Lista</button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={editLink}>Link</button>
        <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => format('unlink')}>Quitar link</button>
      </div>
      <div
        ref={editorRef}
        className="admin-rich-text-editor"
        contentEditable
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        suppressContentEditableWarning
        onInput={emit}
        onBlur={() => {
          const editor = editorRef.current;
          if (!editor) return;
          editor.innerHTML = sanitizeCvRichText(editor.innerHTML);
          emit();
        }}
      />
      <small>Enter crea un párrafo. Para agregar o editar un link, seleccioná el texto y tocá “Link”.</small>
    </div>
  );
}

function CvSectionFields({ section, path, onChange }) {
  const englishContent = section.contentHtml || cvItemsToRichText(section.items);
  return (
    <div className="admin-content-fields admin-cv-section-fields">
      <label className="admin-content-field field-wide"><span>Título · Inglés</span><input type="text" value={section.title || ''} onChange={event => onChange([...path, 'title'], event.target.value)} /></label>
      <label className="admin-content-field field-wide"><span>Título · Español</span><input type="text" value={section.titleEs || ''} onChange={event => onChange([...path, 'titleEs'], event.target.value)} /></label>
      <RichTextEditor label="Entradas · Inglés" value={englishContent} onChange={value => onChange([...path, 'contentHtml'], value)} />
      <RichTextEditor label="Entradas · Español" value={section.contentHtmlEs || translateCvRichText(englishContent)} onChange={value => onChange([...path, 'contentHtmlEs'], value)} />
    </div>
  );
}

function ContentFields({ value, path = [], onChange, onMove, onAdd, onRemove, projectCategory = null, includeKeys = null }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  if (Array.isArray(value)) {
    const kind = path.at(-1);
    const objectList = ['projects', 'images', 'links', 'sections', 'items', 'rows'].includes(kind);
    const objectItems = objectList || value.some(item => item && typeof item === 'object');
    if (!objectItems) {
      const fieldName = path.at(-1);
      const paragraphs = ['paragraphs', 'paragraphsEs', 'practiceParagraphs'].includes(fieldName);
      const separator = paragraphs ? '\n\n' : '\n';
      return (
        <label className="admin-content-field field-wide admin-combined-text">
          <span>Contenido</span>
          <textarea
            value={value.join(separator)}
            rows={Math.min(22, Math.max(8, value.length + 4))}
            onChange={event => onChange(path, event.target.value.split(paragraphs ? /\n\s*\n/ : /\n/).map(item => item.trim()).filter(Boolean))}
          />
        </label>
      );
    }
    const reorderable = ['projects', 'images', 'links', 'sections', 'items', 'rows'].includes(kind);
    const editableList = ['projects', 'images', 'links', 'sections', 'items', 'rows'].includes(kind);
    const addLabel = kind === 'projects'
      ? 'Agregar proyecto'
      : kind === 'links'
        ? 'Agregar enlace'
        : kind === 'sections'
          ? 'Agregar sección'
        : kind === 'items'
            ? 'Agregar entrada'
            : kind === 'rows'
              ? 'Agregar fila'
            : 'Agregar imagen';
    return (
      <div className={`admin-content-list ${dragIndex !== null ? 'is-reordering' : ''}`}>
        {value.map((item, index) => ({ item, index })).filter(({ item }) => kind !== 'projects' || !projectCategory || item.category === projectCategory).map(({ item, index }) => {
          const itemPath = [...path, index];
          if (item && typeof item === 'object') return (
            <details
              id={kind === 'projects' ? `admin-project-${item.slug}` : undefined}
              className={`admin-content-card ${kind === 'projects' ? 'admin-project-card' : ''} ${dragIndex === index ? 'is-dragging' : ''} ${dropTarget?.index === index ? `is-drop-${dropTarget.position}` : ''}`}
              key={item.id || item.slug || index}
              onDragOver={event => {
                if (!reorderable || dragIndex === null || dragIndex === index) return;
                event.preventDefault();
                const rect = event.currentTarget.getBoundingClientRect();
                setDropTarget({ index, position: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' });
                event.dataTransfer.dropEffect = 'move';
              }}
              onDrop={event => {
                event.preventDefault();
                if (reorderable && dragIndex !== null && dragIndex !== index) {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
                  let destination = index + (position === 'after' ? 1 : 0);
                  if (dragIndex < destination) destination -= 1;
                  if (dragIndex !== destination) onMove(path, dragIndex, destination);
                }
                setDragIndex(null);
                setDropTarget(null);
              }}
            >
              <summary
                className={thumbnailForItem(item) ? 'has-thumbnail' : ''}
                draggable={reorderable}
                onDragStart={event => {
                  setDragIndex(index);
                  setDropTarget(null);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', String(index));
                }}
                onDragEnd={() => { setDragIndex(null); setDropTarget(null); }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {thumbnailForItem(item) && <img src={thumbnailForItem(item)} alt="" />}
                <strong>{titleForItem(item, index)}</strong>
                <span className="admin-card-actions">{reorderable && <em title="Arrastrar para reordenar">↕</em>}<b>＋</b></span>
              </summary>
              <div className="admin-content-card-body">
                {editableList && <button className="admin-remove-item" type="button" onClick={() => onRemove(path, index)}>Eliminar</button>}
                <ContentFields value={item} path={itemPath} onChange={onChange} onMove={onMove} onAdd={onAdd} onRemove={onRemove} projectCategory={projectCategory} />
              </div>
            </details>
          );
          return null;
        })}
        {editableList && kind !== 'images' && <button className="admin-add-item" type="button" onClick={() => onAdd(path)}>＋ {addLabel}</button>}
        {kind === 'images' && (
          <div className="admin-media-add-actions" aria-label="Agregar contenido multimedia">
            <button type="button" onClick={() => onAdd(path, 'image')}><span>＋</span> Agregar imagen</button>
            <button type="button" onClick={() => onAdd(path, 'video')}><span>＋</span> Subir video</button>
            <button type="button" onClick={() => onAdd(path, 'youtube')}><span>＋</span> Incrustar YouTube</button>
          </div>
        )}
      </div>
    );
  }

  const isProject = path[0] === 'projects' && path.length === 2;
  if (isProject) return <ProjectFields project={value} path={path} onChange={onChange} onMove={onMove} onAdd={onAdd} onRemove={onRemove} projectCategory={projectCategory} />;
  const isMediaItem = path.at(-2) === 'images' && typeof path.at(-1) === 'number';
  if (isMediaItem) return <MediaItemFields item={value} path={path} onChange={onChange} isExhibition={Boolean(projectCategory)} />;
  const isCvSection = path.at(-2) === 'sections' && typeof path.at(-1) === 'number';
  if (isCvSection) return <CvSectionFields section={value} path={path} onChange={onChange} />;

  return (
    <div className="admin-content-fields">
      {Object.entries(value || {}).filter(([key]) => (!includeKeys || includeKeys.includes(key)) && !hiddenKeys.has(key) && key !== 'year' && !(key === 'imageUrl' && path[0] === 'projects' && path.length === 2)).map(([key, fieldValue]) => {
        const fieldPath = [...path, key];
        const label = labels[key] || key;
        if (imageKeys.has(key)) return <ImageField key={key} label={label} value={fieldValue} onChange={next => onChange(fieldPath, next)} />;
        if (Array.isArray(fieldValue) || (fieldValue && typeof fieldValue === 'object')) return (
          <section className="admin-content-group" key={key}>
            <h3>{label}</h3>
            <ContentFields value={fieldValue} path={fieldPath} onChange={onChange} onMove={onMove} onAdd={onAdd} onRemove={onRemove} projectCategory={projectCategory} />
          </section>
        );
        if (key === 'category') return (
          <label className="admin-content-field" key={key}>
            <span>{label}</span>
            <select value={fieldValue} onChange={event => onChange(fieldPath, event.target.value)}>
              <option value="group">Group</option>
              <option value="solo">Individual</option>
            </select>
          </label>
        );
        const long = String(fieldValue ?? '').length > 90 || ['intro', 'introEs', 'description', 'subtitle', 'text', 'textEs'].includes(key);
        const statementField = ['intro', 'introEs'].includes(key);
        return (
          <label className={`admin-content-field ${long ? 'field-wide' : ''}`} key={key}>
            <span>{label}</span>
            {long ? <textarea value={fieldValue ?? ''} rows={statementField ? 10 : 4} onChange={event => onChange(fieldPath, event.target.value)} /> : (
              <input type={typeof fieldValue === 'number' ? 'number' : 'text'} value={fieldValue ?? ''} onChange={event => onChange(fieldPath, typeof fieldValue === 'number' ? Number(event.target.value) : event.target.value)} />
            )}
          </label>
        );
      })}
    </div>
  );
}

function AdminFieldGroup({ title, description, children, className = '' }) {
  return (
    <section className={`admin-page-group ${className}`.trim()}>
      <header><h2>{title}</h2><p>{description}</p></header>
      {children}
    </section>
  );
}

function MenuLanguageEditor({ title, language, draft, onChange, onMove }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const order = normalizeNavigationOrder(draft.menuOrder);
  const itemsById = new Map(NAVIGATION_ITEMS.map(item => [item.id, item]));

  const moveItem = (from, to) => {
    if (to < 0 || to >= order.length || from === to) return;
    onMove(['menuOrder'], from, to);
  };

  return (
    <details className="admin-menu-language">
      <summary>
        <span>{title}</span>
        <small>{order.length} elementos</small>
        <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg>
      </summary>
      <div className="admin-menu-language-body">
        <p>Arrastrá los elementos o usá las flechas para cambiar su posición. El orden es el mismo para los dos idiomas.</p>
        <div className="admin-menu-items">
          {order.map((id, index) => {
            const item = itemsById.get(id);
            const labelKey = language === 'es' ? item.labelKeyEs : item.labelKey;
            return (
              <div
                className={`admin-menu-item ${dragIndex === index ? 'is-dragging' : ''} ${dropTarget === index ? 'is-drop-target' : ''}`}
                key={id}
                onDragOver={event => {
                  if (dragIndex === null || dragIndex === index) return;
                  event.preventDefault();
                  setDropTarget(index);
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={event => {
                  event.preventDefault();
                  if (dragIndex !== null) moveItem(dragIndex, index);
                  setDragIndex(null);
                  setDropTarget(null);
                }}
              >
                <span
                  className="admin-menu-drag"
                  draggable
                  title="Arrastrar para reordenar"
                  onDragStart={event => {
                    setDragIndex(index);
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', id);
                  }}
                  onDragEnd={() => { setDragIndex(null); setDropTarget(null); }}
                >
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  <b aria-hidden="true">↕</b>
                </span>
                <label>
                  <span>Texto visible</span>
                  <input type="text" value={draft[labelKey] || ''} onChange={event => onChange([labelKey], event.target.value)} />
                </label>
                <small>{item.route}</small>
                <div className="admin-menu-position-actions">
                  <button type="button" onClick={() => moveItem(index, index - 1)} disabled={index === 0} aria-label={`Subir ${draft[labelKey] || id}`}>↑</button>
                  <button type="button" onClick={() => moveItem(index, index + 1)} disabled={index === order.length - 1} aria-label={`Bajar ${draft[labelKey] || id}`}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function SectionEditor({ active, draft, onChange, onMove, onAdd, onRemove, projectCategory }) {
  const fields = keys => (
    <ContentFields value={draft} includeKeys={keys} onChange={onChange} onMove={onMove} onAdd={onAdd} onRemove={onRemove} projectCategory={projectCategory} />
  );

  if (active === 'global') return (
    <AdminFieldGroup title="Menú de navegación" description="Abrí un idioma para editar los nombres y el orden de los enlaces del encabezado.">
      <div className="admin-menu-languages">
        <MenuLanguageEditor title="Español" language="es" draft={draft} onChange={onChange} onMove={onMove} />
        <MenuLanguageEditor title="English" language="en" draft={draft} onChange={onChange} onMove={onMove} />
      </div>
    </AdminFieldGroup>
  );
  if (active === 'home') return (
    <AdminFieldGroup title="Portada" description="La imagen que ocupa la pantalla principal del sitio.">
      {fields(['heroImageUrl'])}
    </AdminFieldGroup>
  );
  if (active === 'work' || active === 'exhibitions') return (
    <AdminFieldGroup title="Proyectos" description="Abrí un proyecto para editar sus datos, textos y contenido multimedia.">
      {fields(['projects'])}
    </AdminFieldGroup>
  );
  if (active === 'statement') return (
    <>
      <AdminFieldGroup title="Imagen" description="Imagen editorial que acompaña el Statement.">{fields(['imageUrl', 'imageAlt'])}</AdminFieldGroup>
      <AdminFieldGroup title="Encabezado" description="Título visible del Statement.">{fields(['title'])}</AdminFieldGroup>
      <div className="admin-language-columns">
        <AdminFieldGroup className="admin-language-panel" title="Texto · English" description="Contenido que se muestra en inglés.">{fields(['paragraphs'])}</AdminFieldGroup>
        <AdminFieldGroup className="admin-language-panel" title="Texto · Español" description="Contenido que se muestra en español.">{fields(['paragraphsEs'])}</AdminFieldGroup>
      </div>
    </>
  );
  if (active === 'contact') return (
    <>
      <AdminFieldGroup title="Presentación" description="Imagen y encabezado de la página de contacto.">{fields(['imageUrl', 'imageAlt', 'title', 'subtitle'])}</AdminFieldGroup>
      <AdminFieldGroup title="Enlaces" description="Canales de contacto y redes sociales visibles.">{fields(['links'])}</AdminFieldGroup>
    </>
  );
  if (active === 'cv') return (
    <>
      <AdminFieldGroup title="Presentación" description="Retrato y statement del CV.">{fields(['imageUrl', 'imageAlt'])}</AdminFieldGroup>
      <div className="admin-language-columns">
        <AdminFieldGroup className="admin-language-panel" title="Statement · English" description="Texto que se muestra en inglés.">
          <RichTextEditor label="Contenido · Inglés" value={draft.introHtml || plainTextToCvHtml(draft.intro)} onChange={value => onChange(['introHtml'], value)} />
        </AdminFieldGroup>
        <AdminFieldGroup className="admin-language-panel" title="Statement · Español" description="Texto que se muestra en español.">
          <RichTextEditor label="Contenido · Español" value={draft.introHtmlEs || plainTextToCvHtml(draft.introEs)} onChange={value => onChange(['introHtmlEs'], value)} />
        </AdminFieldGroup>
      </div>
      <AdminFieldGroup title="Trayectoria" description="Cada sección reúne todas sus entradas en un único editor de texto con links editables.">{fields(['sections'])}</AdminFieldGroup>
    </>
  );
  if (active === 'workshops') return (
    <AdminFieldGroup title="Filas de talleres" description="Cada fila tiene una imagen y su texto en inglés y español. Podés arrastrarlas para cambiar el orden.">{fields(['rows'])}</AdminFieldGroup>
  );
  return fields(Object.keys(draft || {}));
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [content, setContent] = useState(() => clone(defaultSiteContent));
  const [active, setActive] = useState('home');
  const [exhibitionCategory, setExhibitionCategory] = useState('group');
  const [draft, setDraft] = useState(() => clone(defaultSiteContent.home));
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [processingMedia, setProcessingMedia] = useState(() => new Set());
  const mediaBusy = processingMedia.size > 0;

  const trackMediaProcessing = useCallback((token, processing) => {
    setProcessingMedia(current => {
      const next = new Set(current);
      if (processing) next.add(token);
      else next.delete(token);
      return next;
    });
  }, []);

  const loadContent = async () => {
    const stored = await api.adminContent();
    const merged = mergeSiteContent(stored);
    setContent(merged);
    setDraft(clone(merged[active]));
  };

  useEffect(() => { api.session().then(async () => { setAuth(true); await loadContent(); }).catch(() => setAuth(false)); }, []);

  const selectSection = (key, category = null) => {
    if (key === active && (key !== 'exhibitions' || category === exhibitionCategory)) return true;
    if (mediaBusy) {
      setStatus('Esperá a que termine de procesarse la imagen antes de cambiar de sección.');
      return false;
    }
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Querés salir de esta sección?')) return false;
    if (category) setExhibitionCategory(category);
    setActive(key); setDraft(clone(content[key])); setDirty(false); setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const openExhibitionEditor = (category, slug) => {
    if (!selectSection('exhibitions', category)) return;
    window.setTimeout(() => {
      const card = document.getElementById(`admin-project-${slug}`);
      if (!card) return;
      card.open = true;
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const updateAtPath = (path, value) => {
    setDraft(current => {
      const next = clone(current);
      let target = next;
      path.slice(0, -1).forEach(part => { target = target[part]; });
      target[path.at(-1)] = value;
      return next;
    });
    setDirty(true); setStatus('Cambios sin guardar.');
  };

  const moveAtPath = (path, from, to) => {
    setDraft(current => {
      const next = clone(current);
      let list = next;
      path.forEach(part => { list = list[part]; });
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      return next;
    });
    setDirty(true); setStatus('Orden actualizado. Guardá los cambios para publicarlo.');
  };

  const addAtPath = (path, mediaType = 'image') => {
    setDraft(current => {
      const next = clone(current);
      let list = next;
      path.forEach(part => { list = list[part]; });
      const kind = path.at(-1);
      const project = path[0] === 'projects' && Number.isInteger(path[1]) ? next.projects[path[1]] : null;
      if (kind === 'projects') {
        const slug = uniqueId(active === 'work' ? 'nuevo-work' : 'nueva-exhibition');
        const title = active === 'work' ? 'Nuevo work' : 'New exhibition';
        const image = { id: uniqueId('imagen'), mediaType: 'image', title: 'Nueva imagen', series: title, technique: '', description: '', imageUrl: '/exhibicion-01.png', alt: 'Nueva imagen' };
        list.push({
          slug, title, ...(active === 'exhibitions' ? { titleEs: 'Nueva exposición' } : {}), imageUrl: '/exhibicion-01.png',
          intro: '', introEs: '', statementVersion: 1,
          images: [image], ...(active === 'exhibitions' ? { category: exhibitionCategory } : {})
        });
      } else if (kind === 'links') {
        list.push({ label: 'Nuevo enlace', value: '', url: '' });
      } else if (kind === 'sections') {
        list.push({ title: 'New section', titleEs: 'Nueva sección', contentHtml: '<ul><li>New entry</li></ul>', contentHtmlEs: '<ul><li>Nueva entrada</li></ul>', items: [] });
      } else if (kind === 'items') {
        list.push({ title: 'Nueva entrada', contentHtml: '', href: '' });
      } else if (kind === 'rows') {
        const number = String(list.length + 1).padStart(2, '0');
        list.push({
          title: `Workshop ${number}`,
          titleEs: `Taller ${number}`,
          imageUrl: '/contact/Andrea-Alkalay.jpg.avif',
          imageAlt: 'Andrea Alkalay',
          imageAltEs: 'Andrea Alkalay',
          text: 'Workshop information.',
          textEs: 'Información del taller.'
        });
      } else {
        const base = {
          id: uniqueId(mediaType), mediaType, series: project?.title || '', technique: '', description: '', alt: ''
        };
        const bilingualTitle = (title, titleEs) => active === 'exhibitions' ? { title, titleEs } : { title: titleEs };
        if (mediaType === 'video') list.push({ ...base, ...bilingualTitle('New video', 'Nuevo video'), imageUrl: '', posterUrl: '' });
        else if (mediaType === 'youtube') list.push({ ...base, ...bilingualTitle('New YouTube video', 'Nuevo video de YouTube'), imageUrl: '', posterUrl: '', embedUrl: '' });
        else list.push({ ...base, ...bilingualTitle('New image', 'Nueva imagen'), imageUrl: project?.imageUrl || '/exhibicion-01.png', alt: 'Nueva imagen' });
      }
      return next;
    });
    setDirty(true); setStatus('Nuevo elemento agregado. Completá sus datos y guardá los cambios.');
  };

  const removeAtPath = (path, index) => {
    const kind = path.at(-1);
    if (kind === 'projects' && active === 'work' && draft.projects.length <= 1) {
      window.alert('Work debe conservar al menos un proyecto porque Home utiliza ese contenido.');
      return;
    }
    const message = kind === 'projects'
      ? '¿Eliminar este proyecto y todo su contenido?'
      : kind === 'links'
        ? '¿Eliminar este enlace?'
      : kind === 'sections'
          ? '¿Eliminar esta sección de CV?'
          : kind === 'items'
            ? '¿Eliminar esta entrada de CV?'
            : kind === 'rows'
              ? '¿Eliminar esta fila de Workshops?'
            : '¿Eliminar esta imagen?';
    if (!window.confirm(message)) return;
    setDraft(current => {
      const next = clone(current);
      let list = next;
      path.forEach(part => { list = list[part]; });
      list.splice(index, 1);
      return next;
    });
    setDirty(true); setStatus('Elemento eliminado. Guardá los cambios para confirmar.');
  };

  const save = async event => {
    event.preventDefault();
    if (mediaBusy) {
      setStatus('Esperá a que termine de procesarse la imagen antes de guardar.');
      return;
    }
    if (active === 'global') {
      const menuKeys = NAVIGATION_ITEMS.flatMap(item => [item.labelKey, item.labelKeyEs]);
      if (menuKeys.some(key => !String(draft[key] || '').trim())) {
        setStatus('Completá todos los nombres del menú antes de guardar.');
        return;
      }
      if (menuKeys.some(key => String(draft[key]).trim().length > 32)) {
        setStatus('Los nombres del menú pueden tener hasta 32 caracteres.');
        return;
      }
    }
    if (active === 'work' || active === 'exhibitions') {
      for (const project of draft.projects || []) {
        const invalidItem = (project.images || []).find(item => mediaValidationError(item));
        if (invalidItem) {
          setStatus(`${project.title}: ${mediaValidationError(invalidItem)}`);
          return;
        }
      }
    }
    setBusy(true); setStatus('Guardando…');
    try {
      const saved = await api.updateContent(active, draft);
      setContent(current => ({ ...current, [active]: saved }));
      setDraft(clone(saved)); setDirty(false); setStatus('Cambios publicados correctamente.');
      window.dispatchEvent(new Event(SITE_CONTENT_UPDATED_EVENT));
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  const logout = async () => { await api.logout(); setAuth(false); };
  const current = sections.find(section => section.key === active);
  const currentLabel = active === 'exhibitions' ? (exhibitionCategory === 'group' ? 'Exhibitions · Group' : 'Exhibitions · Individual') : current.label;
  const previewRoute = active === 'exhibitions' ? `/exhibitions#${exhibitionCategory}-show` : current.route;
  if (auth === null) return <div className="admin-boot">abriendo editor…</div>;
  if (!auth) return <Login onSuccess={async () => { setAuth(true); await loadContent(); }} />;

  return (
    <div className="admin-app admin-content-app">
      <aside className="admin-sidebar">
        <div><Link to="/" className="admin-brand">andrea alkalay</Link><span>panel de contenido</span></div>
        <nav>
          {sections.map(section => section.key === 'exhibitions' ? (
            <div className={`admin-nav-group ${active === 'exhibitions' ? 'is-active' : ''}`} key={section.key}>
              <span>Exhibitions</span>
              {[{ key: 'group', label: 'Group' }, { key: 'solo', label: 'Individual' }].map(group => (
                <details className="admin-nav-category" key={group.key} defaultOpen={active === 'exhibitions' && exhibitionCategory === group.key}>
                  <summary onClick={() => selectSection('exhibitions', group.key)}>
                    <span>{group.label}</span>
                    <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg>
                  </summary>
                  <div>
                    {content.exhibitions.projects.filter(project => project.category === group.key).map(project => (
                      <button type="button" key={project.slug} onClick={() => openExhibitionEditor(group.key, project.slug)}>{project.title}</button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <button className={active === section.key ? 'is-active' : ''} type="button" key={section.key} onClick={() => selectSection(section.key)}>{section.label}</button>
          ))}
        </nav>
        <div className="admin-sidebar-foot"><button type="button" onClick={logout}>Cerrar sesión</button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="eyebrow">Contenido del sitio</span><h1>{currentLabel}</h1></div>
          <Link className="admin-preview-link" to={previewRoute} target="_blank">Ver página ↗</Link>
        </header>
        <MediaProcessingContext.Provider value={trackMediaProcessing}>
          <form className="admin-content-editor" onSubmit={save} aria-busy={mediaBusy || busy}>
            {active === 'exhibitions' && <ProjectCovers projects={draft.projects} onChange={updateAtPath} category={exhibitionCategory} />}
            {active === 'work' && <ProjectCovers projects={draft.projects} onChange={updateAtPath} />}
            <SectionEditor active={active} draft={draft} onChange={updateAtPath} onMove={moveAtPath} onAdd={addAtPath} onRemove={removeAtPath} projectCategory={active === 'exhibitions' ? exhibitionCategory : null} />
            <div className="admin-content-savebar">
              <p role="status">{mediaBusy ? 'Procesando imagen…' : status}</p>
              <button type="submit" disabled={busy || mediaBusy || !dirty}>{mediaBusy ? 'Procesando imagen…' : busy ? 'Guardando…' : 'Guardar cambios →'}</button>
            </div>
          </form>
        </MediaProcessingContext.Provider>
      </main>
    </div>
  );
}
