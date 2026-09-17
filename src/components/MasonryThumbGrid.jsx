import { Fragment, useEffect, useMemo, useState } from 'react';
import { toMasonryColumns } from '../projectNavigation';

const getColumnCount = () => {
  if (typeof window === 'undefined') return 3;
  if (window.matchMedia('(max-width: 680px)').matches) return 1;
  if (window.matchMedia('(max-width: 980px)').matches) return 2;
  return 3;
};

export function MasonryColumns({ items, getKey, renderItem, keyPrefix = 'masonry', className = '' }) {
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getColumnCount());
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const columns = useMemo(() => toMasonryColumns(items, columnCount), [items, columnCount]);

  return (
    <div className={`artwork-thumb-grid artwork-thumb-masonry ${className}`.trim()} style={{ '--masonry-columns': columnCount }}>
      {columns.map((column, columnIndex) => (
        <div className="artwork-thumb-column" key={`${keyPrefix}-column-${columnIndex}`}>
          {column.map(({ item, sourceIndex }) => (
            <Fragment key={getKey(item, sourceIndex)}>{renderItem(item, sourceIndex)}</Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MasonryThumbGrid({ items, getKey, onOpen, keyPrefix = 'masonry', showCaptions = false }) {
  return (
    <MasonryColumns
      items={items}
      getKey={getKey}
      keyPrefix={keyPrefix}
      renderItem={(item, index) => {
            const visibleTitle = String(item.title || '').trim();
            return (
              <button
                type="button"
                onClick={() => onOpen(item, index)}
                className="artwork-thumb"
              >
                {item.mediaType === 'video' || item.mediaType === 'youtube' ? (
                  <>
                    <img src={item.posterUrl} alt={item.alt || item.title || 'Video artwork by Andrea Alkalay'} loading="lazy" decoding="async" />
                    <span className="media-play-indicator" aria-hidden="true">
                      <svg viewBox="0 0 16 18"><path d="M15 9 1 17V1z" /></svg>
                    </span>
                  </>
                ) : <img src={item.imageUrl} alt={item.alt || item.title || 'Artwork by Andrea Alkalay'} loading="lazy" decoding="async" />}
                {showCaptions && visibleTitle ? <span className="artwork-thumb-caption">{visibleTitle}</span> : null}
              </button>
            );
      }}
    />
  );
}
