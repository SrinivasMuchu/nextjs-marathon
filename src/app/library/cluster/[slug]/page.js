import { notFound } from 'next/navigation';
import Library from '@/Components/Library/Library';
import { fetchLibraryClusters, getLibraryClusterPath } from '@/api/libraryClustersApi';
import { ASSET_PREFIX_URL } from '@/config';
import { getLibraryCanonicalAndRobots } from '@/common.helper';

export async function generateMetadata({ params, searchParams }) {
  const slug = params?.slug;
  const clusters = await fetchLibraryClusters({ slug });
  const cluster = clusters[0];
  if (!cluster) {
    return { title: 'Build kit | Marathon OS' };
  }

  const page = parseInt(searchParams?.page, 10) || 1;
  const path = getLibraryClusterPath(cluster, '3d');
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  if (nextPath) linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title: `${cluster.cluster_name} CAD Build Kit | Marathon OS${page > 1 ? ` - Page ${page}` : ''}`,
    description:
      cluster.cluster_description ||
      cluster.cluster_use_case ||
      `Browse the ${cluster.cluster_name} CAD build kit on Marathon OS.`,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default async function LibraryClusterPage({ params, searchParams }) {
  const slug = params?.slug;
  const clusters = await fetchLibraryClusters({ slug });
  const cluster = clusters[0];
  if (!cluster) {
    notFound();
  }

  const merged = {
    ...searchParams,
    cluster_id: cluster.cluster_id,
    cluster_slug: cluster.cluster_slug,
  };

  return (
    <div>
      <Library searchParams={merged} />
    </div>
  );
}
