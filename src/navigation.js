export const NAVIGATION_ITEMS = [
  { id: 'work', route: '/work', labelKey: 'workMenuLabel', labelKeyEs: 'workMenuLabelEs' },
  { id: 'exhibitions', route: '/exhibitions', labelKey: 'exhibitionsMenuLabel', labelKeyEs: 'exhibitionsMenuLabelEs' },
  { id: 'bio', route: '/cv', labelKey: 'bioMenuLabel', labelKeyEs: 'bioMenuLabelEs' },
  { id: 'news', route: '/news', labelKey: 'newsMenuLabel', labelKeyEs: 'newsMenuLabelEs' },
  { id: 'workshops', route: '/workshops', labelKey: 'workshopsMenuLabel', labelKeyEs: 'workshopsMenuLabelEs' },
  { id: 'contact', route: '/contacto', labelKey: 'contactMenuLabel', labelKeyEs: 'contactMenuLabelEs' }
];

export const DEFAULT_NAVIGATION_ORDER = NAVIGATION_ITEMS.map(item => item.id);

export const normalizeNavigationOrder = order => {
  const validIds = new Set(DEFAULT_NAVIGATION_ORDER);
  const normalized = [];

  if (Array.isArray(order)) {
    order.forEach(id => {
      if (validIds.has(id) && !normalized.includes(id)) normalized.push(id);
    });
  }

  DEFAULT_NAVIGATION_ORDER.forEach(id => {
    if (!normalized.includes(id)) normalized.push(id);
  });

  return normalized;
};
