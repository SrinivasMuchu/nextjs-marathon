import Library from '@/Components/Library/Library';
import { ASSET_PREFIX_URL } from '@/config';
import { getLibraryCanonicalAndRobots, getLibraryFileFormatPath } from '@/common.helper';
import { LIBRARY_FILE_FORMAT_PAGES } from '@/data/libraryPage';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params, searchParams }) {
  const format = params?.format;
  const pageConfig = LIBRARY_FILE_FORMAT_PAGES[format];
  if (!pageConfig) notFound();

  const page = parseInt(searchParams?.page, 10) || 1;
  const path = getLibraryFileFormatPath(format);
  const { canonicalPath, robots, prevPath, nextPath } = getLibraryCanonicalAndRobots({
    path,
    searchParams: searchParams ?? {},
  });

  const base = 'https://marathon-os.com';
  const linkOther = [];
  if (prevPath) linkOther.push({ rel: 'prev', url: `${base}${prevPath}` });
  if (nextPath) linkOther.push({ rel: 'next', url: `${base}${nextPath}` });

  return {
    title: pageConfig.title + (page > 1 ? ` - Page ${page}` : ''),
    description: pageConfig.description,
    ...(robots && { robots: { index: false, follow: true } }),
    openGraph: {
      images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
    },
    metadataBase: new URL(base),
    alternates: { canonical: canonicalPath },
    ...(linkOther.length > 0 && { icons: { other: linkOther } }),
  };
}

export default function LibraryFileFormatPage({ params, searchParams }) {
  const format = params?.format;
  const pageConfig = LIBRARY_FILE_FORMAT_PAGES[format];
  if (!pageConfig) notFound();

  const queryParams = searchParams ?? {};
  const merged = {
    ...queryParams,
    file_format: pageConfig.apiValue,
    libraryPageVariant: 'file-format',
    libraryPageSlug: format,
  };

  return <Library searchParams={merged} pageConfig={pageConfig} />;
}
