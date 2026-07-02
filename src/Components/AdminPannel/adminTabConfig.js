export const ADMIN_TABS = [
  'designs',
  'payments',
  'controls',
  'viewed-list',
  'downloaded-list',
  'searched-list',
  'ratings-list',
  'likes-list',
  'cad-service-requests',
  'techdraw-jobs',
  'vendors',
];

export const DEFAULT_ADMIN_TAB = 'designs';

const ADMIN_TAB_SET = new Set(ADMIN_TABS);

export function isValidAdminTab(tab) {
  return ADMIN_TAB_SET.has(tab);
}

export function adminTabFromSearchParams(searchParams) {
  const tab = searchParams?.get?.('tab') || '';
  return isValidAdminTab(tab) ? tab : DEFAULT_ADMIN_TAB;
}

export function adminHrefForTab(tab) {
  const normalized = isValidAdminTab(tab) ? tab : DEFAULT_ADMIN_TAB;
  if (normalized === DEFAULT_ADMIN_TAB) return '/admin';
  return `/admin?tab=${encodeURIComponent(normalized)}`;
}
