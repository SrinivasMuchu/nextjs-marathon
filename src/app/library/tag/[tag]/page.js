import { permanentRedirect } from 'next/navigation';
import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import {
  normalizeLibraryTagSlug,
  getLibraryPath,
  getLibraryCanonicalAndRobots,
} from '@/common.helper';
import { formatLibraryFacetLabel } from '@/lib/seo/libraryLabels';
import { tagListingDescription } from '@/lib/seo/listingCopy';

function requireValidTagSlug(rawSlug) {
  const slug = normalizeLibraryTagSlug(rawSlug);
  if (!slug) permanentRedirect('/library');
  return slug;
}

export async function generateMetadata({ params, searchParams }) {
  const tagSlug = requireValidTagSlug(params?.tag || '');
  const tagLabel = formatLibraryFacetLabel(tagSlug);
  const page = parseInt(searchParams?.page) || 1;

  const title = `${tagLabel} CAD Models | STEP, STL, IGES Downloads | Marathon OS${page > 1 ? ` - Page ${page}` : ''}`;
  const description = tagListingDescription(tagLabel);

  const path = getLibraryPath({ tagName: tagSlug });
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  if (nextPath) linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title,
    description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      url: canonicalPath,
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default function LibraryTagPage({ params, searchParams }) {
  const tagSlug = requireValidTagSlug(params?.tag || '');
  const merged = { ...searchParams, tags: tagSlug };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
