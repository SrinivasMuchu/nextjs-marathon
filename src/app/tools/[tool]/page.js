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
    return <CadHomeDesign type={true} />;
  }

  if (isConvert) {
    if (!converterTypes.some((type) => type.path === `/${conversion}`)) return notFound();
    return <CadFileConversionHome convert={true} conversionParams={conversion} />;
  }

  return notFound();
}
