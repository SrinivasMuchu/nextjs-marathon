import ResourcesHubPage from '@/Components/ResourcesHub/ResourcesHubPage';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/resources';

export const metadata = {
  title: 'Resources — Guides & References | Marathon OS',
  description:
    'Marathon OS resources: engineering guides, references, and downloads for CAD and hardware teams.',
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function ResourcesIndexPage() {
  return <ResourcesHubPage />;
}
