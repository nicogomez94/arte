import { useEffect, useMemo, useState } from 'react';

const getColumnCount = () => {
  if (typeof window === 'undefined') return 3;
  if (window.matchMedia('(max-width: 680px)').matches) return 1;
  if (window.matchMedia('(max-width: 980px)').matches) return 2;
  return 3;
};

export default function MasonryThumbGrid({ items, getKey, onOpen, keyPrefix = 'masonry' }) {
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getColumnCount());
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const columns = useMemo(() => {
    const nextColumns = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      nextColumns[index % columnCount].push({ item, index });
    });
    return nextColumns;
  }, [items, columnCount]);

  return (
    <div className="artwork-thumb-grid artwork-thumb-masonry" style={{ '--masonry-columns': columnCount }}>
      {columns.map((column, columnIndex) => (
        <div className="artwork-thumb-column" key={`${keyPrefix}-column-${columnIndex}`}>
          {column.map(({ item, index }) => (
            <button
              type="button"
              key={getKey(item, index)}
              onClick={() => onOpen(item, index)}
              className="artwork-thumb"
            >
              <img src={item.imageUrl} alt="" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
