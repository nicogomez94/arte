export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm']);

export const validateVideoUpload = (mime, size, data = null) => {
  const normalizedMime = String(mime || '').toLowerCase();
  if (!VIDEO_MIME_TYPES.has(normalizedMime)) {
    return 'Elegí un video MP4 o WebM.';
  }
  if (!Number.isInteger(size) || size <= 0) return 'El archivo de video está vacío.';
  if (size > MAX_VIDEO_BYTES) return 'El video supera los 50 MB.';
  if (Buffer.isBuffer(data)) {
    const isMp4 = data.length >= 8 && data.subarray(4, 8).toString('ascii') === 'ftyp';
    const isWebm = data.length >= 4 && data.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    if ((normalizedMime === 'video/mp4' && !isMp4) || (normalizedMime === 'video/webm' && !isWebm)) {
      return 'El archivo no coincide con un video MP4 o WebM válido.';
    }
  }
  return null;
};

export const parseByteRange = (header, size) => {
  const match = String(header || '').match(/^bytes=(\d*)-(\d*)$/);
  if (!match || !Number.isInteger(size) || size <= 0) return null;

  let start;
  let end;
  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  }

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= size || end < start) return null;
  return { start, end: Math.min(end, size - 1) };
};
