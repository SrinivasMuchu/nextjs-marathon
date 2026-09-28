import FilterQueryRobotsTag from '@/Components/Library/FilterQueryRobotsTag';

/**
 * Persist the library robots helper across listing route changes
 * (/library → /library/tag/…, category+tag, 2D tag paths) so noindex
 * is not dropped when the page component remounts.
 */
export default function LibraryLayout({ children }) {
  return (
    <>
      <FilterQueryRobotsTag />
      {children}
    </>
  );
}
