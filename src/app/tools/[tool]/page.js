import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import { ASSET_PREFIX_URL } from '@/config';
import { converterTypes } from '@/common.helper';
import { notFound } from 'next/navigation';

const ALLOWED_CAD_FILES = ['step', 'brep', 'stp', 'off', 'obj', 'iges', 'igs', 'stl', 'brp', 'ply'];
const BASE_URL = 'https://marathon-os.com';

function parseCadFileFromSegment(segment) {
  if (!segment || typeof segment !== 'string') return null;
  const match = segment.match(/^(.+)-file-viewer$/);
  return match ? match[1].toLowerCase() : segment.toLowerCase();
}

function buildViewerJsonLdData(cadFile) {
  const pageUrl = `${BASE_URL}/tools/${cadFile}-file-viewer`;
  const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;
  const formatUpper = cadFile.toUpperCase();
  const pageName = `${formatUpper} File Viewer – Instantly Open & Explore ${formatUpper} Files`;
  const pageDescription = `View ${formatUpper} (${cadFile}) files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds. Our proprietary rendering engine ensures smooth performance with zero lag and no glitches, even for large assemblies.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Marathon OS',
    url: pageUrl,
    image: imageUrl,
    description: pageDescription,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'The CAD marketplace for modern teams',
    operatingSystem: 'Web-based',
    softwareVersion: '1.0.0',
    publisher: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL, logo: imageUrl },
    author: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL },
    sameAs: ['https://www.linkedin.com/company/marathon-os'],
  };
}

function buildConverterJsonLdData(conversion) {
  const pageUrl = `${BASE_URL}/tools/convert-${conversion}`;
  const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;
  const [from, to] = (conversion || '').split('-to-');
  const fromUpper = (from || '').toUpperCase();
  const toUpper = (to || '').toUpperCase();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': pageUrl,
        name: 'Marathon OS 3D File Converter',
        alternateName: 'Free Online 3D File Converter',
        description: 'Fast and secure cloud-based 3D file converter. Convert between STEP, IGES, STL, OBJ, PLY, OFF, BREP formats instantly—no software required.',
        url: pageUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        image: imageUrl,
        author: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL, logo: imageUrl },
        sameAs: ['https://www.linkedin.com/company/marathon-os'],
      },
    ],
  };
}

export async function generateMetadata({ params }) {
  const segment = params?.tool ?? '';
  const isViewer = /^.+-file-viewer$/.test(segment);
  const isConvert = segment.startsWith('convert-');
  const conversion = isConvert ? segment.slice(8) : '';

  if (isViewer) {
    const cadFile = parseCadFileFromSegment(segment);
    if (!cadFile || !ALLOWED_CAD_FILES.includes(cadFile)) return { title: 'Not Found' };
    return {
      title: `${cadFile.toUpperCase()} File Viewer – Instantly Open & Explore ${cadFile.toUpperCase()} Files`,
      description: `View ${cadFile.toUpperCase()} (${cadFile}) files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds. Our proprietary rendering engine ensures smooth performance with zero lag and no glitches, even for large assemblies.`,
      openGraph: { images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }] },
      metadataBase: new URL(BASE_URL),
      alternates: { canonical: `/tools/${cadFile}-file-viewer` },
    };
  }

  if (isConvert && converterTypes.some((type) => type.path === `/${conversion}`)) {
    const [from, to] = conversion.split('-to-');
    return {
      title: `Free Online ${from?.toUpperCase()} to ${to?.toUpperCase()} Converter | Marathon OS`,
      description: `Convert ${from?.toUpperCase()} files to ${to?.toUpperCase()} online with Marathon OS. Fast, secure conversion.`,
      openGraph: { images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }] },
      metadataBase: new URL(BASE_URL),
      alternates: { canonical: `/tools/convert-${conversion}` },
    };
  }

  return { title: 'Not Found' };
}

export default function ToolPage({ params }) {
  const segment = params?.tool ?? '';
  const isViewer = /^.+-file-viewer$/.test(segment);
  const isConvert = segment.startsWith('convert-');
  const conversion = isConvert ? segment.slice(8) : '';

  if (isViewer) {
    const cadFile = parseCadFileFromSegment(segment);
    if (!cadFile || !ALLOWED_CAD_FILES.includes(cadFile)) return notFound();
    const jsonLdData = buildViewerJsonLdData(cadFile);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
        <CadHomeDesign type={true} />
      </>
    );
  }

  if (isConvert) {
    if (!converterTypes.some((type) => type.path === `/${conversion}`)) return notFound();
    const jsonLdData = buildConverterJsonLdData(conversion);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
        <CadFileConversionHome convert={true} conversionParams={conversion} />
      </>
    );
  }

  return notFound();
}
