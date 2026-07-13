export const LIBRARY_PAGE_WINDOW_SIZE = 5;

export function hasLibraryNarrowingFilters({
  category,
  tags,
  search,
  recency,
  free_paid,
  file_format,
  two_dims,
  cluster_id,
}) {
  return Boolean(
    (category && String(category).trim()) ||
      (tags && String(tags).trim()) ||
      (search && String(search).trim()) ||
      (recency && String(recency).trim()) ||
      (free_paid && String(free_paid).trim()) ||
      (file_format && String(file_format).trim()) ||
      ['1', 'true', 'yes'].includes(String(two_dims || '').trim().toLowerCase()) ||
      (cluster_id && String(cluster_id).trim())
  );
}

/**
 * Amazon-style sliding window: up to 5 page numbers, ellipses, never beyond totalPages.
 */
export function getLibraryPaginationWindow({
  currentPage,
  totalPages = 1,
  hasNextPage,
  hasPrevPage,
  windowSize = LIBRARY_PAGE_WINDOW_SIZE,
  showCompactTotals = false,
}) {
  const maxPage = Math.max(1, totalPages);
  const page = Math.min(Math.max(1, currentPage), maxPage);
  const half = Math.floor(windowSize / 2);

  if (showCompactTotals && totalPages > 0 && totalPages <= windowSize) {
    return {
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      showLeadingEllipsis: false,
      showTrailingEllipsis: false,
      hasNext: hasNextPage ?? page < totalPages,
      hasPrev: hasPrevPage ?? page > 1,
    };
  }

  let start = page <= half + 1 ? 1 : page - half;
  if (start + windowSize - 1 > maxPage) {
    start = Math.max(1, maxPage - windowSize + 1);
  }

  const pages = [];
  for (let p = start; p <= Math.min(start + windowSize - 1, maxPage); p += 1) {
    pages.push(p);
  }

  const resolvedHasNext = hasNextPage ?? page < maxPage;
  const resolvedHasPrev = hasPrevPage ?? page > 1;

  return {
    pages,
    showLeadingEllipsis: start > 1,
    showTrailingEllipsis: resolvedHasNext,
    hasNext: resolvedHasNext,
    hasPrev: resolvedHasPrev,
  };
}

export function formatLibraryResultsCount(pagination, fallbackCount = 0) {
  if (pagination?.hasMoreResults && pagination?.totalItems != null) {
    return `${Number(pagination.totalItems).toLocaleString()}+`;
  }
  return String(pagination?.totalItems ?? fallbackCount ?? 0);
}
