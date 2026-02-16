import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import { tagSlugToName } from '@/common.helper';

export async function generateMetadata({ params, searchParams }) {
  const tagSlug = params?.tag || '';
  const tagName = tagSlugToName(tagSlug);
  const page = parseInt(searchParams?.page) || 1;

  const title = tagName
    ? `CAD Designs - ${tagName} - Library${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`
    : `CAD Design Library${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`;

  const description = tagName
    ? `Browse 3D CAD models tagged with ${tagName}. Preview and download STEP, STL, IGES and more.`
    : 'Browse Marathon OS\'s CAD Design Library. Search and filter by category or tags.';

  const canonicalPath = tagSlug ? `/library/tag/${encodeURIComponent(tagSlug)}` : '/library';

  return {
    title,
    description,
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL('https://marathon-os.com'),
    alternates: { canonical: canonicalPath },
  };
}

export default function LibraryTagPage({ params, searchParams }) {
  const tagSlug = params?.tag || '';
  const tagName = tagSlugToName(tagSlug);
  const merged = { ...searchParams, tags: tagName || undefined };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
