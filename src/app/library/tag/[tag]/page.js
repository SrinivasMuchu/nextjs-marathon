import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import { tagSlugToName, getLibraryCanonicalAndRobots } from '@/common.helper';

export async function generateMetadata({ params, searchParams }) {
  const tagSlug = params?.tag || '';
  const tagValue = tagSlugToName(tagSlug); // raw cad_tag_name (keeps hyphens)
  const tagLabel = tagValue.replace(/-/g, ' '); // nicer display for meta
  const page = parseInt(searchParams?.page) || 1;

  const title = tagLabel
    ? `${tagLabel} CAD Models | STEP, STL, IGES Downloads | Marathon OS${page > 1 ? ` - Page ${page}` : ''}`
    : `CAD Design Library${page > 1 ? ` - Page ${page}` : ''} | Marathon OS`;

  const description = tagLabel
    ? `Explore ${tagLabel} 3D CAD models and download STEP/STP, IGES, STL and more. Filter by category, file type, price & popularity. Preview online.`
    : 'Browse Marathon OS\'s CAD Design Library. Search and filter by category or tags.';

  const path = tagSlug ? `/library/tag/${encodeURIComponent(tagSlug)}` : '/library';
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title,
    description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default function LibraryTagPage({ params, searchParams }) {
  const tagSlug = params?.tag || '';
  const tagValue = tagSlugToName(tagSlug); // raw cad_tag_name
  const merged = { ...searchParams, tags: tagValue || undefined };
  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
