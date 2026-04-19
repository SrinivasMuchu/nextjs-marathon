import { ASSET_PREFIX_URL } from '@/config';
import ToolsHubPage from '@/Components/ToolsHub/ToolsHubPage';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools';
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

export const metadata = {
  title: 'Free CAD Tools — Viewer, Converter & Org Chart | Marathon OS',
  description:
    'Explore Marathon OS tools: browser-based 3D CAD viewer, online file converter, and organization chart maker. Built for engineering and hardware teams.',
  openGraph: {
    title: 'Free CAD Tools — Viewer, Converter & Org Chart | Marathon OS',
    description:
      'Explore Marathon OS tools: browser-based 3D CAD viewer, online file converter, and organization chart maker.',
    images: [{ url: imageUrl, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function ToolsIndexPage() {
  return <ToolsHubPage />;
}
