const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || 'No se pudo completar la acción.');
  return data;
};

const publicTranslations = {
  'Vista de sala I': 'Exhibition View I',
  'Vista de sala II': 'Exhibition View II',
  'Instalación · medios mixtos': 'Installation · mixed media',
  'Fotografía expandida': 'Expanded photography',
  'Investigación visual': 'Visual research',
  'Fotografía y materialidad': 'Photography and materiality',
  'Vista general de la instalación Unfixed Landscapes': 'Installation view of Unfixed Landscapes',
  'Instalaciones y obras de Unfixed Landscapes': 'Installations and works from Unfixed Landscapes',
  'Obra de paisaje en sala oscura': 'Landscape artwork in a dark exhibition room',
  'Instalación vinculada al paisaje y la materia': 'Installation exploring landscape and matter'
};

const toEnglishArtwork = artwork => Object.fromEntries(
  Object.entries(artwork).map(([key, value]) => [key, publicTranslations[value] || value])
);

export const api = {
  artworks: () => request('/api/artworks').then(items => items.map(toEnglishArtwork)),
  session: () => request('/api/admin/session'),
  adminArtworks: () => request('/api/admin/artworks'),
  login: password => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => request('/api/admin/logout', { method: 'POST', body: '{}' }),
  createArtwork: artwork => request('/api/admin/artworks', { method: 'POST', body: JSON.stringify(artwork) }),
  updateArtwork: artwork => request(`/api/admin/artworks/${artwork.id}`, { method: 'PUT', body: JSON.stringify(artwork) }),
  deleteArtwork: id => request(`/api/admin/artworks/${id}`, { method: 'DELETE' })
};
