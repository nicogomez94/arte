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

export const api = {
  artworks: () => request('/api/artworks'),
  session: () => request('/api/admin/session'),
  adminArtworks: () => request('/api/admin/artworks'),
  login: password => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => request('/api/admin/logout', { method: 'POST', body: '{}' }),
  createArtwork: artwork => request('/api/admin/artworks', { method: 'POST', body: JSON.stringify(artwork) }),
  updateArtwork: artwork => request(`/api/admin/artworks/${artwork.id}`, { method: 'PUT', body: JSON.stringify(artwork) }),
  deleteArtwork: id => request(`/api/admin/artworks/${id}`, { method: 'DELETE' })
};
