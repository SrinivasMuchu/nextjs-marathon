import LibraryTagsPage from '@/Components/Library/LibraryTagsPage';
import { ASSET_PREFIX_URL } from '@/config';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/library/tags';

export const metadata = {
  title: 'CAD Parts & Functions — Browse All Tags | Marathon OS',
  description:
    'Browse all CAD part types and functions in the Marathon OS 3D library. Filter models by fasteners, bearings, gears, actuators, and more.',
  openGraph: {
    title: 'CAD Parts & Functions — Browse All Tags | Marathon OS',
    description:
      'Browse all CAD part types and functions in the Marathon OS 3D library. Filter models by fasteners, bearings, gears, actuators, and more.',
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function LibraryTagsIndexPage() {
  return <LibraryTagsPage libraryMode="3d" />;
}
