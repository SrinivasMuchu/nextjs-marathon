import ResourcesHubPage from '@/Components/ResourcesHub/ResourcesHubPage';
import { ASSET_PREFIX_URL } from '@/config';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/resources';
const ogImageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

export const metadata = {
  title: 'Resources — Guides & References | Marathon OS',
  description:
    'Marathon OS resources: engineering guides, references, and downloads for CAD and hardware teams.',
  openGraph: {
    title: 'Resources — Guides & References | Marathon OS',
    description:
      'Marathon OS resources: engineering guides, references, and downloads for CAD and hardware teams.',
    images: [{ url: ogImageUrl, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function ResourcesIndexPage() {
  return <ResourcesHubPage />;
}
