export const toMasonryColumns = (items, columnCount = 4) => (
  (items || []).reduce((columns, item, sourceIndex) => {
    columns[sourceIndex % columnCount].push({ item, sourceIndex });
    return columns;
  }, Array.from({ length: columnCount }, () => []))
);

export const nextProjectInSequence = (items, currentSlug) => {
  const projects = items || [];
  if (projects.length < 2) return null;
  const currentIndex = projects.findIndex(project => project.slug === currentSlug);
  if (currentIndex < 0) return null;
  return projects[(currentIndex + 1) % projects.length];
};
