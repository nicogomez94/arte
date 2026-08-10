export const normalizeStoredContent = stored => (
  stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}
);

export const mergeContentSections = (defaults, stored = {}) => {
  const normalizedStored = normalizeStoredContent(stored);
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      value && typeof value === 'object' && !Array.isArray(value)
        ? { ...value, ...(normalizedStored[key] || {}) }
        : (normalizedStored[key] ?? value)
    ])
  );
};
