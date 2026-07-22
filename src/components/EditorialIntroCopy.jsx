import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '../siteContent';

const COLLAPSED_LINE_COUNT = 10;

export default function EditorialIntroCopy({ title, children, text }) {
  const global = useSiteContent('global');
  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const textNode = textRef.current;
    if (!textNode) return undefined;
    setExpanded(false);

    const updateCanExpand = () => {
      const lineHeight = Number.parseFloat(window.getComputedStyle(textNode).lineHeight);
      const maxHeight = lineHeight * COLLAPSED_LINE_COUNT;
      setCanExpand(textNode.scrollHeight > maxHeight + 1);
    };

    updateCanExpand();

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', updateCanExpand);
      return () => window.removeEventListener('resize', updateCanExpand);
    }

    const observer = new ResizeObserver(updateCanExpand);
    observer.observe(textNode);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="editorial-intro-copy">
      <h3>{title}</h3>
      <div className={`intro-text-shell ${canExpand && !expanded ? 'is-faded' : ''}`}>
        <p
          ref={textRef}
          className={!expanded ? 'is-clamped' : undefined}
          style={{ '--collapsed-lines': COLLAPSED_LINE_COUNT }}
        >
          {text}
        </p>
      </div>
      {canExpand && (
        <button
          className="intro-expand-button"
          type="button"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
        >
          {expanded ? global.showLessLabel : global.expandLabel}
        </button>
      )}
      {children}
    </div>
  );
}
