import { notFound } from 'next/navigation';
import TwoDLibrary from '@/Components/Library/TwoDLibrary';
import { fetchLibraryClusters, getLibraryClusterPath } from '@/api/libraryClustersApi';
import { TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata({ params, searchParams }) {
  const slug = params?.slug;
  const clusters = await fetchLibraryClusters({ slug, twoDims: true });
  const cluster = clusters[0];
  if (!cluster) {
    return { title: '2D Build Kit | Marathon OS' };
  }

  const page = parseInt(searchParams?.page, 10) || 1;
  return buildPageMetadata({
    title: `${cluster.cluster_name} 2D Drawing Build Kit | Marathon OS${
      page > 1 ? ` - Page ${page}` : ''
    }`,
    description:
      cluster.cluster_description ||
      cluster.cluster_use_case ||
      `Browse 2D drawing sets in the ${cluster.cluster_name} build kit on Marathon OS.`,
    canonicalPath: getLibraryClusterPath(cluster, '2d'),
  });
}

export default async function TwoDLibraryClusterPage({ params, searchParams }) {
  const slug = params?.slug;
  const clusters = await fetchLibraryClusters({ slug, twoDims: true });
  const cluster = clusters[0];
  if (!cluster) {
    notFound();
  }

  const merged = {
    ...searchParams,
    cluster_id: cluster.cluster_id,
    cluster_slug: cluster.cluster_slug,
  };

  return <TwoDLibrary searchParams={merged} basePath={TWO_D_LIBRARY_BASE} />;
}
