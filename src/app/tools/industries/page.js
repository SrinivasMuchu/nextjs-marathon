import IndustriesDirectoryPage from '@/Components/IndustriesHub/IndustriesDirectoryPage';
import { ASSET_PREFIX_URL } from '@/config';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/industries';
const ogImageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

export const metadata = {
  title: 'Industry CAD Viewers — Browse by Sector | Marathon OS',
  description:
    'Browse Marathon OS industry CAD viewer pages: open sector-specific landing pages to upload and review STEP, IGES, STL, and more in your browser.',
  openGraph: {
    title: 'Industry CAD Viewers — Browse by Sector | Marathon OS',
    description:
      'Browse Marathon OS industry CAD viewer pages: open sector-specific landing pages to upload and review STEP, IGES, STL, and more in your browser.',
    images: [{ url: ogImageUrl, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function ToolsIndustriesPage() {
  return <IndustriesDirectoryPage />;
}
