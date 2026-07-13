import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { defaultSiteContent, mergeSiteContent } from '../siteContent';

const sections = [
  { key: 'home', label: 'Home', route: '/' },
  { key: 'work', label: 'Work', route: '/work' },
  { key: 'exhibitions', label: 'Exhibitions', route: '/exhibitions' },
  { key: 'statement', label: 'Statement', route: '/statement' },
  { key: 'contact', label: 'Contact', route: '/contacto' },
  { key: 'cv', label: 'CV', route: '/cv' }
];

const labels = {
  artistName: 'Nombre de la artista', artistDiscipline: 'Disciplina', workMenuLabel: 'Texto del menú Work',
  exhibitionsMenuLabel: 'Texto del menú Exhibitions', statementMenuLabel: 'Texto del menú Statement',
  contactMenuLabel: 'Texto del menú Contact', cvMenuLabel: 'Texto del menú CV', instagramUrl: 'Enlace de Instagram',
  footerText: 'Texto del pie', heroImageUrl: 'Imagen principal', heroImageAlt: 'Descripción de la imagen principal',
  startViewingLabel: 'Texto de iniciar recorrido', expandLabel: 'Texto de expandir', showLessLabel: 'Texto de contraer',
  pauseLabel: 'Texto de pausa', playLabel: 'Texto de reproducción', closeLabel: 'Texto de cerrar', noImagesLabel: 'Mensaje sin imágenes',
  heroCaption: 'Epígrafe', selectedWorkLabel: 'Título de la sección', viewWorkLabel: 'Texto del botón',
  viewMoreLabel: 'Texto de ver más', projects: 'Proyectos', title: 'Título', year: 'Año', imageUrl: 'Imagen',
  alt: 'Descripción de imagen', intro: 'Introducción', images: 'Galería de imágenes', series: 'Serie',
  technique: 'Técnica', description: 'Descripción', gridImages: 'Imágenes de la grilla', paragraphs: 'Párrafos',
  eyebrow: 'Etiqueta superior', nameFirstLine: 'Primera línea del nombre',
  nameSecondLine: 'Segunda línea del nombre', role: 'Descripción profesional', portraitImageUrl: 'Retrato',
  portraitImageAlt: 'Descripción del retrato', practiceLabel: 'Etiqueta de práctica', practiceTitle: 'Título de práctica',
  practiceParagraphs: 'Textos de práctica', detailImageUrl: 'Imagen de detalle', detailImageAlt: 'Descripción de imagen de detalle',
  detailCaption: 'Epígrafe de detalle', detailLabel: 'Etiqueta de detalle', detailTitle: 'Título de detalle',
  facts: 'Datos', label: 'Etiqueta', value: 'Texto visible', linkLabel: 'Texto del enlace', imageAlt: 'Descripción de imagen',
  subtitle: 'Bajada', links: 'Enlaces', url: 'Destino del enlace', introLabel: 'Título de introducción',
  sections: 'Secciones del CV', items: 'Entradas', category: 'Categoría'
};

const hiddenKeys = new Set(['slug', 'id', 'category', 'slideIndex', 'published', 'position', 'createdAt', 'updatedAt']);
const imageKeys = new Set(['imageUrl', 'heroImageUrl', 'portraitImageUrl', 'detailImageUrl']);
const clone = value => JSON.parse(JSON.stringify(value));
const titleForItem = (item, index) => item.title || item.label || item.value || `Elemento ${index + 1}`;
const uniqueId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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
  const choose = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { onChange(await imageFromFile(file)); }
    catch (error) { window.alert(error.message); }
    finally { setBusy(false); event.target.value = ''; }
  };
  return (
    <div className="admin-content-image-field">
      <span>{label}</span>
      <button type="button" onClick={() => input.current?.click()} disabled={busy}>
        <img src={value} alt="" />
        <em>{busy ? 'Preparando…' : 'Cambiar imagen'}</em>
      </button>
      <input ref={input} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={choose} />
    </div>
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

function ContentFields({ value, path = [], onChange, onMove, onAdd, onRemove, projectCategory = null }) {
  const [dragIndex, setDragIndex] = useState(null);
  if (Array.isArray(value)) {
    const objectItems = value.some(item => item && typeof item === 'object');
    if (!objectItems) {
      const fieldName = path.at(-1);
      const paragraphs = ['paragraphs', 'practiceParagraphs'].includes(fieldName);
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
    const kind = path.at(-1);
    const reorderable = ['projects', 'images', 'gridImages'].includes(kind);
    const editableList = ['projects', 'images', 'gridImages', 'links'].includes(kind);
    const addLabel = kind === 'projects' ? 'Agregar proyecto' : kind === 'links' ? 'Agregar enlace' : 'Agregar imagen';
    return (
      <div className="admin-content-list">
        {value.map((item, index) => ({ item, index })).filter(({ item }) => kind !== 'projects' || !projectCategory || item.category === projectCategory).map(({ item, index }) => {
          const itemPath = [...path, index];
          if (item && typeof item === 'object') return (
            <details
              id={kind === 'projects' ? `admin-project-${item.slug}` : undefined}
              className={`admin-content-card ${dragIndex === index ? 'is-dragging' : ''}`}
              key={item.id || item.slug || index}
              onDragOver={event => { if (reorderable) event.preventDefault(); }}
              onDrop={event => {
                event.preventDefault();
                if (reorderable && dragIndex !== null && dragIndex !== index) onMove(path, dragIndex, index);
                setDragIndex(null);
              }}
            >
              <summary
                className={item.imageUrl ? 'has-thumbnail' : ''}
                draggable={reorderable}
                onDragStart={event => { setDragIndex(index); event.dataTransfer.effectAllowed = 'move'; }}
                onDragEnd={() => setDragIndex(null)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.imageUrl && <img src={item.imageUrl} alt="" />}
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
        {editableList && <button className="admin-add-item" type="button" onClick={() => onAdd(path)}>＋ {addLabel}</button>}
      </div>
    );
  }

  return (
    <div className="admin-content-fields">
      {Object.entries(value || {}).filter(([key]) => !hiddenKeys.has(key) && !(key === 'imageUrl' && path[0] === 'projects' && path.length === 2)).map(([key, fieldValue]) => {
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
              <option value="group">Group Show</option>
              <option value="solo">Solo Show</option>
            </select>
          </label>
        );
        const long = String(fieldValue ?? '').length > 90 || ['intro', 'description', 'subtitle'].includes(key);
        return (
          <label className={`admin-content-field ${long ? 'field-wide' : ''}`} key={key}>
            <span>{label}</span>
            {long ? <textarea value={fieldValue ?? ''} rows="4" onChange={event => onChange(fieldPath, event.target.value)} /> : (
              <input type={typeof fieldValue === 'number' ? 'number' : 'text'} value={fieldValue ?? ''} onChange={event => onChange(fieldPath, typeof fieldValue === 'number' ? Number(event.target.value) : event.target.value)} />
            )}
          </label>
        );
      })}
    </div>
  );
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

  const loadContent = async () => {
    const stored = await api.adminContent();
    const merged = mergeSiteContent(stored);
    setContent(merged);
    setDraft(clone(merged[active]));
  };

  useEffect(() => { api.session().then(async () => { setAuth(true); await loadContent(); }).catch(() => setAuth(false)); }, []);

  const selectSection = (key, category = null) => {
    if (key === active && (key !== 'exhibitions' || category === exhibitionCategory)) return true;
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

  const addAtPath = path => {
    setDraft(current => {
      const next = clone(current);
      let list = next;
      path.forEach(part => { list = list[part]; });
      const kind = path.at(-1);
      const project = path[0] === 'projects' && Number.isInteger(path[1]) ? next.projects[path[1]] : null;
      if (kind === 'projects') {
        const slug = uniqueId(active === 'work' ? 'nuevo-work' : 'nueva-exhibition');
        const title = active === 'work' ? 'Nuevo work' : 'Nueva exhibition';
        const image = { id: uniqueId('imagen'), title: 'Nueva imagen', series: title, year: new Date().getFullYear(), technique: '', description: '', imageUrl: '/exhibicion-01.png', alt: 'Nueva imagen' };
        list.push({
          slug, title, year: new Date().getFullYear(), imageUrl: '/exhibicion-01.png', intro: '',
          images: [image], ...(active === 'work' ? { gridImages: [{ ...image, id: uniqueId('grilla'), slideIndex: 0 }] } : { category: exhibitionCategory })
        });
      } else if (kind === 'links') {
        list.push({ label: 'Nuevo enlace', value: '', url: '' });
      } else {
        list.push({
          id: uniqueId(kind === 'gridImages' ? 'grilla' : 'imagen'),
          title: 'Nueva imagen', series: project?.title || '', year: project?.year || new Date().getFullYear(),
          technique: '', description: '', imageUrl: project?.imageUrl || '/exhibicion-01.png', alt: 'Nueva imagen',
          ...(kind === 'gridImages' ? { slideIndex: project?.images?.length ? project.images.length - 1 : 0 } : {})
        });
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
    const message = kind === 'projects' ? '¿Eliminar este proyecto y todo su contenido?' : kind === 'links' ? '¿Eliminar este enlace?' : '¿Eliminar esta imagen?';
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
    event.preventDefault(); setBusy(true); setStatus('Guardando…');
    try {
      const saved = await api.updateContent(active, draft);
      setContent(current => ({ ...current, [active]: saved }));
      setDraft(clone(saved)); setDirty(false); setStatus('Cambios publicados correctamente.');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  const logout = async () => { await api.logout(); setAuth(false); };
  const current = sections.find(section => section.key === active);
  const currentLabel = active === 'exhibitions' ? (exhibitionCategory === 'group' ? 'Exhibitions · Group Show' : 'Exhibitions · Solo Show') : current.label;
  const previewRoute = active === 'exhibitions' ? `/exhibitions#${exhibitionCategory}-show` : current.route;
  const visibleDraft = active === 'home' ? {
    heroImageUrl: draft.heroImageUrl,
    heroImageAlt: draft.heroImageAlt,
    heroCaption: draft.heroCaption
  } : draft;

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
              {[{ key: 'group', label: 'Group Show' }, { key: 'solo', label: 'Solo Show' }].map(group => (
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
        <form className="admin-content-editor" onSubmit={save}>
          {(active === 'work' || active === 'exhibitions') && <ProjectCovers projects={draft.projects} onChange={updateAtPath} category={active === 'exhibitions' ? exhibitionCategory : null} />}
          <ContentFields value={visibleDraft} onChange={updateAtPath} onMove={moveAtPath} onAdd={addAtPath} onRemove={removeAtPath} projectCategory={active === 'exhibitions' ? exhibitionCategory : null} />
          <div className="admin-content-savebar"><p role="status">{status}</p><button type="submit" disabled={busy || !dirty}>{busy ? 'Guardando…' : 'Guardar cambios →'}</button></div>
        </form>
      </main>
    </div>
  );
}
