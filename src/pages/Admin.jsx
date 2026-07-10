import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { defaultSiteContent } from '../siteContent';

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
  technique: 'Técnica', description: 'Descripción', gridImages: 'Imágenes de la grilla', paragraphs: 'Párrafos', bioTitle: 'Título de biografía',
  bioParagraphs: 'Párrafos de biografía', eyebrow: 'Etiqueta superior', nameFirstLine: 'Primera línea del nombre',
  nameSecondLine: 'Segunda línea del nombre', role: 'Descripción profesional', portraitImageUrl: 'Retrato',
  portraitImageAlt: 'Descripción del retrato', practiceLabel: 'Etiqueta de práctica', practiceTitle: 'Título de práctica',
  practiceParagraphs: 'Textos de práctica', detailImageUrl: 'Imagen de detalle', detailImageAlt: 'Descripción de imagen de detalle',
  detailCaption: 'Epígrafe de detalle', detailLabel: 'Etiqueta de detalle', detailTitle: 'Título de detalle',
  facts: 'Datos', label: 'Etiqueta', value: 'Texto visible', linkLabel: 'Texto del enlace', imageAlt: 'Descripción de imagen',
  subtitle: 'Bajada', links: 'Enlaces', url: 'Destino del enlace', introLabel: 'Título de introducción',
  sections: 'Secciones del CV', items: 'Entradas'
};

const hiddenKeys = new Set(['slug', 'id', 'slideIndex', 'published', 'position', 'createdAt', 'updatedAt']);
const imageKeys = new Set(['imageUrl', 'heroImageUrl', 'portraitImageUrl', 'detailImageUrl']);
const clone = value => JSON.parse(JSON.stringify(value));
const titleForItem = (item, index) => item.title || item.label || item.value || `Elemento ${index + 1}`;

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

function ContentFields({ value, path = [], onChange }) {
  if (Array.isArray(value)) {
    const objectItems = value.some(item => item && typeof item === 'object');
    if (!objectItems) {
      const fieldName = path.at(-1);
      const paragraphs = ['paragraphs', 'bioParagraphs', 'practiceParagraphs'].includes(fieldName);
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
    return (
      <div className="admin-content-list">
        {value.map((item, index) => {
          const itemPath = [...path, index];
          if (item && typeof item === 'object') return (
            <details className="admin-content-card" key={item.id || item.slug || index}>
              <summary className={item.imageUrl ? 'has-thumbnail' : ''}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.imageUrl && <img src={item.imageUrl} alt="" />}
                <strong>{titleForItem(item, index)}</strong><b>＋</b>
              </summary>
              <div className="admin-content-card-body"><ContentFields value={item} path={itemPath} onChange={onChange} /></div>
            </details>
          );
          return null;
        })}
      </div>
    );
  }

  return (
    <div className="admin-content-fields">
      {Object.entries(value || {}).filter(([key]) => !hiddenKeys.has(key)).map(([key, fieldValue]) => {
        const fieldPath = [...path, key];
        const label = labels[key] || key;
        if (imageKeys.has(key)) return <ImageField key={key} label={label} value={fieldValue} onChange={next => onChange(fieldPath, next)} />;
        if (Array.isArray(fieldValue) || (fieldValue && typeof fieldValue === 'object')) return (
          <section className="admin-content-group" key={key}>
            <h3>{label}</h3>
            <ContentFields value={fieldValue} path={fieldPath} onChange={onChange} />
          </section>
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
  const [draft, setDraft] = useState(() => clone(defaultSiteContent.home));
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const loadContent = async () => {
    const stored = await api.adminContent();
    const merged = Object.fromEntries(Object.entries(defaultSiteContent).map(([key, value]) => [key, { ...clone(value), ...(stored[key] || {}) }]));
    setContent(merged);
    setDraft(clone(merged[active]));
  };

  useEffect(() => { api.session().then(async () => { setAuth(true); await loadContent(); }).catch(() => setAuth(false)); }, []);

  const selectSection = key => {
    if (key === active) return;
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Querés salir de esta sección?')) return;
    setActive(key); setDraft(clone(content[key])); setDirty(false); setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          {sections.map(section => (
            <button className={active === section.key ? 'is-active' : ''} type="button" key={section.key} onClick={() => selectSection(section.key)}>
              {section.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot"><button type="button" onClick={logout}>Cerrar sesión</button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="eyebrow">Contenido del sitio</span><h1>{current.label}</h1></div>
          <Link className="admin-preview-link" to={current.route} target="_blank">Ver página ↗</Link>
        </header>
        <form className="admin-content-editor" onSubmit={save}>
          <ContentFields value={visibleDraft} onChange={updateAtPath} />
          <div className="admin-content-savebar"><p role="status">{status}</p><button type="submit" disabled={busy || !dirty}>{busy ? 'Guardando…' : 'Guardar cambios →'}</button></div>
        </form>
      </main>
    </div>
  );
}
