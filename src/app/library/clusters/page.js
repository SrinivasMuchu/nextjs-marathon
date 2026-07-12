import LibraryClustersPage from '@/Components/Library/LibraryClustersPage';
import { ASSET_PREFIX_URL } from '@/config';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/library/clusters';

export const metadata = {
  title: 'CAD Build Kits & Collections | Marathon OS',
  description:
    'Browse curated CAD build kits with verified mating parts — motion kits, hardware packs, robotics, drones and more on Marathon OS.',
  openGraph: {
    title: 'CAD Build Kits & Collections | Marathon OS',
    description:
      'Browse curated CAD build kits with verified mating parts — motion kits, hardware packs, robotics, drones and more on Marathon OS.',
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function LibraryClustersIndexPage() {
  return <LibraryClustersPage />;
}
