const VIDEO_EXTENSION = /\.(?:mp4|webm)(?:[?#].*)?$/i;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export const mediaTypeFor = item => {
  if (item?.mediaType === 'youtube' || item?.embedUrl) return 'youtube';
  if (item?.mediaType === 'video' || VIDEO_EXTENSION.test(item?.imageUrl || '')) return 'video';
  return 'image';
};

export const normalizeMediaItem = item => {
  const { slideIndex: _slideIndex, ...media } = item || {};
  return { ...media, mediaType: mediaTypeFor(media) };
};

export const normalizeProjectMedia = project => {
  const source = Array.isArray(project?.images)
    ? project.images
    : (Array.isArray(project?.gridImages) ? project.gridImages : []);
  const { gridImages: _gridImages, ...rest } = project || {};
  return { ...rest, images: source.map(normalizeMediaItem) };
};

export const youtubeIdFromUrl = value => {
  const input = String(value || '').trim();
  if (YOUTUBE_ID.test(input)) return input;

  let url;
  try {
    url = new URL(input.startsWith('http') ? input : `https://${input}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0];
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else {
      const [prefix, candidate] = url.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(prefix)) id = candidate;
    }
  }
  return YOUTUBE_ID.test(id || '') ? id : null;
};

export const youtubeMediaFromUrl = (value, defaults = {}) => {
  const id = youtubeIdFromUrl(value);
  if (!id) return null;
  const thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return {
    ...defaults,
    mediaType: 'youtube',
    imageUrl: thumbnailUrl,
    posterUrl: thumbnailUrl,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`
  };
};

export const mediaValidationError = item => {
  const type = mediaTypeFor(item);
  if (type === 'youtube' && !youtubeIdFromUrl(item?.embedUrl)) return 'Completá un enlace válido de YouTube.';
  if (type === 'video' && !String(item?.imageUrl || '').trim()) return 'Seleccioná el archivo del video.';
  if (type === 'image' && !String(item?.imageUrl || '').trim()) return 'Seleccioná el archivo de imagen.';
  return null;
};
