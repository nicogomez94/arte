export const mergeContentSections = (defaults, stored = {}) => Object.fromEntries(
  Object.entries(defaults).map(([key, value]) => [
    key,
    value && typeof value === 'object' && !Array.isArray(value)
      ? { ...value, ...(stored?.[key] || {}) }
      : (stored?.[key] ?? value)
  ])
);
