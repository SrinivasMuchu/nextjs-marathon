import IndustriesDirectoryPage from '@/Components/IndustriesHub/IndustriesDirectoryPage';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/industries';

export const metadata = {
  title: 'Industry CAD Viewers — Browse by Sector | Marathon OS',
  description:
    'Browse Marathon OS industry CAD viewer pages: open sector-specific landing pages to upload and review STEP, IGES, STL, and more in your browser.',
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

export default function ToolsIndustriesPage() {
  return <IndustriesDirectoryPage />;
}
