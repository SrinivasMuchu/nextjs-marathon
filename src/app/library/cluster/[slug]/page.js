import { ASSET_PREFIX_URL } from '@/config';
import LibraryClusterDetail, {
  getLibraryClusterMetadata,
} from '@/Components/Library/LibraryClusterDetail';

export async function generateMetadata({ params }) {
  const meta = await getLibraryClusterMetadata(params?.slug, '3d');
  return {
    ...meta,
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL('https://marathon-os.com'),
  };
}

export default function LibraryClusterDetailPage({ params, searchParams }) {
  return (
    <LibraryClusterDetail
      slug={params?.slug}
      searchParams={searchParams}
      libraryMode="3d"
    />
  );
}
