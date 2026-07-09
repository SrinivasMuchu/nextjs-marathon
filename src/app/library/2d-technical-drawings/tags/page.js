import LibraryTagsPage from '@/Components/Library/LibraryTagsPage';
import { ASSET_PREFIX_URL } from '@/config';
import { TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = `${TWO_D_LIBRARY_BASE}/tags`;

export const metadata = {
  title: '2D Drawing Parts & Functions — Browse All Tags | Marathon OS',
  description:
    'Browse all part types and functions in the Marathon OS 2D technical drawings library. Filter drawings by category and tag.',
  openGraph: {
    title: '2D Drawing Parts & Functions — Browse All Tags | Marathon OS',
    description:
      'Browse all part types and functions in the Marathon OS 2D technical drawings library. Filter drawings by category and tag.',
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function TwoDLibraryTagsIndexPage() {
  return <LibraryTagsPage libraryMode="2d" />;
}
