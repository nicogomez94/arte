import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { DEBUG, debugArtwork } from '../debugDefaults';

const blankArtwork = () => ({
  ...(DEBUG ? debugArtwork : {
    title: '', series: '', year: new Date().getFullYear(), technique: '', description: '', alt: '', published: true, position: 0, imageUrl: ''
  })
});

const imageFromFile = file => new Promise((resolve, reject) => {
  if (!file.type.startsWith('image/')) return reject(new Error('Elegí un archivo de imagen.'));
  if (file.size > 12 * 1024 * 1024) return reject(new Error('La imagen supera los 12 MB.'));
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('No pudimos leer la imagen.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('El archivo no parece ser una imagen válida.'));
    image.onload = () => {
      const max = 2200;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/webp', 0.88));
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
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(password);
      onSuccess();
    } catch (loginError) {
      setError(loginError.message);
    } finally { setBusy(false); }
  };

  return (
    <main className="admin-login">
      <section>
        <Link to="/" className="admin-login-brand">andrea alkalay</Link>
        <span className="eyebrow">Panel de artista</span>
        <h1>Volver al<br /><em>archivo.</em></h1>
        <p>Ingresá tu contraseña para editar las obras que aparecen en el sitio y en el recorrido.</p>
        <form onSubmit={submit}>
          <label htmlFor="admin-password">Contraseña</label>
          <div><input id="admin-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required autoFocus /><button disabled={busy}>{busy ? 'Entrando…' : 'Entrar →'}</button></div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        <small>Acceso privado · sesión protegida</small>
      </section>
      <figure><img src="/exhibicion-02.png" alt="Detalle de obra en exhibición" /><figcaption>Archivo de obra · AA</figcaption></figure>
      <p className="admin-credit">Hecho por <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a></p>
    </main>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [draft, setDraft] = useState(blankArtwork());
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);

  const publishedCount = useMemo(() => artworks.filter(item => item.published).length, [artworks]);
  const seriesCount = useMemo(() => new Set(artworks.map(item => item.series)).size, [artworks]);

  const loadArtworks = async () => {
    const items = await api.adminArtworks();
    setArtworks(items);
    return items;
  };

  useEffect(() => {
    api.session().then(() => Promise.all([setAuth(true), loadArtworks()])).catch(() => setAuth(false));
  }, []);

  const loginSuccess = async () => {
    setAuth(true);
    await loadArtworks();
  };

  const selectArtwork = artwork => {
    setDraft({ ...artwork, year: artwork.year ?? '' });
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newArtwork = () => {
    setDraft({ ...blankArtwork(), position: artworks.length + 1 });
    setStatus('');
  };

  const updateField = event => {
    const { name, value, type, checked } = event.target;
    setDraft(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const chooseImage = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus('Preparando imagen…');
    try {
      const imageUrl = await imageFromFile(file);
      setDraft(current => ({ ...current, imageUrl }));
      setStatus('Imagen lista para guardar.');
    } catch (error) { setStatus(error.message); }
  };

  const save = async event => {
    event.preventDefault();
    if (!draft.imageUrl) { setStatus('Elegí una imagen para la obra.'); return; }
    setBusy(true);
    setStatus('Guardando…');
    try {
      const saved = draft.id ? await api.updateArtwork(draft) : await api.createArtwork(draft);
      await loadArtworks();
      setDraft(saved);
      setStatus('Cambios publicados correctamente.');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (!draft.id || !window.confirm(`¿Eliminar “${draft.title}”? Esta acción no se puede deshacer.`)) return;
    setBusy(true);
    try {
      await api.deleteArtwork(draft.id);
      await loadArtworks();
      newArtwork();
      setStatus('La obra fue eliminada.');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    await api.logout();
    setAuth(false);
  };

  if (auth === null) return <div className="admin-boot">abriendo archivo…</div>;
  if (!auth) return <Login onSuccess={loginSuccess} />;

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div><Link to="/" className="admin-brand">andrea alkalay</Link><span>panel de artista</span></div>
        <nav>
          <button className="is-active" type="button"><i>□</i> Obras <b>{artworks.length}</b></button>
          <button type="button" onClick={newArtwork}><i>＋</i> Nueva obra</button>
          <Link to="/galeria" target="_blank"><i>↗</i> Ver galería</Link>
        </nav>
        <div className="admin-sidebar-foot"><button type="button" onClick={logout}>Cerrar sesión</button><p>Hecho por <a href="https://zigodev.com.ar" target="_blank" rel="noopener noreferrer">zigodev</a></p></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar"><div><span className="eyebrow">Archivo en línea</span><h1>Obras</h1></div><button className="admin-new" type="button" onClick={newArtwork}>＋ Nueva obra</button></header>
        <section className="admin-stats">
          <article><span>Publicadas</span><strong>{publishedCount}</strong></article>
          <article><span>En borrador</span><strong>{artworks.length - publishedCount}</strong></article>
          <article><span>Series</span><strong>{seriesCount}</strong></article>
          <p>Los cambios guardados se reflejan de inmediato en la galería y en el recorrido.</p>
        </section>

        <div className="admin-workspace">
          <section className="admin-archive-panel">
            <header><span>Archivo</span><b>{artworks.length} obras</b></header>
            <div className="admin-artworks">
              {artworks.map((artwork, index) => (
                <button className={draft.id === artwork.id ? 'is-selected' : ''} type="button" key={artwork.id} onClick={() => selectArtwork(artwork)}>
                  <span>{String(index + 1).padStart(2, '0')}</span><img src={artwork.imageUrl} alt="" /><div><strong>{artwork.title}</strong><small>{artwork.series} · {artwork.year || 's/a'}</small></div><em className={artwork.published ? 'published' : ''}>{artwork.published ? 'Visible' : 'Oculta'}</em>
                </button>
              ))}
            </div>
          </section>

          <section className="admin-editor">
            <header><div><span className="eyebrow">{draft.id ? 'Editar obra' : 'Nueva obra'}</span><h2>{draft.id ? draft.title : 'Sumar al archivo'}</h2></div>{draft.id && <button type="button" className="delete-button" onClick={remove} disabled={busy}>Eliminar</button>}</header>
            <form onSubmit={save}>
              <button className={`image-uploader ${draft.imageUrl ? 'has-image' : ''}`} type="button" onClick={() => fileInput.current?.click()}>
                {draft.imageUrl ? <img src={draft.imageUrl} alt="Vista previa" /> : <span><b>＋</b> Elegir imagen<small>JPG, PNG o WEBP · máx. 12 MB</small></span>}
                {draft.imageUrl && <em>Cambiar imagen</em>}
              </button>
              <input ref={fileInput} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} />
              <div className="editor-fields">
                <label className="field-wide"><span>Título</span><input name="title" value={draft.title} onChange={updateField} maxLength="140" required /></label>
                <label><span>Serie</span><input name="series" value={draft.series} onChange={updateField} maxLength="100" required /></label>
                <label><span>Año</span><input name="year" value={draft.year} onChange={updateField} type="number" min="1900" max="2100" /></label>
                <label><span>Técnica</span><input name="technique" value={draft.technique || ''} onChange={updateField} maxLength="140" /></label>
                <label><span>Orden</span><input name="position" value={draft.position} onChange={updateField} type="number" min="0" /></label>
                <label className="field-wide"><span>Descripción</span><textarea name="description" value={draft.description || ''} onChange={updateField} rows="4" maxLength="1200" /></label>
                <label className="field-wide"><span>Texto alternativo de la imagen</span><input name="alt" value={draft.alt || ''} onChange={updateField} maxLength="220" placeholder="Describí brevemente lo que se ve" /></label>
              </div>
              <label className="publish-toggle"><input name="published" type="checkbox" checked={draft.published} onChange={updateField} /><span /><div><strong>Visible en la galería</strong><small>Si lo desactivás, la obra queda guardada como borrador.</small></div></label>
              <div className="editor-actions"><p role="status">{status}</p><button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios →'}</button></div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
