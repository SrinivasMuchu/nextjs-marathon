import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import ConvertPairPage from '@/Components/CadUploadingHome/CadFileConversion/ConvertPairPage';
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd';
import ToolPageJsonLd from '@/Components/JsonLdSchemas/ToolPageJsonLd';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import { getConverterFaqQuestions, cadViewerFaqQuestions } from '@/data/cadToolFaqs';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { converterTypes } from '@/common.helper';
import {
  CAD_VIEWER_FORMAT_SLUGS,
  getViewerPageMetadata,
  isCadViewerFormatSlug,
} from '@/data/cadFormatViewerPages';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://marathon-os.com';

const CONVERTER_META_TO_PHRASE = {
  brep: 'BREP online for Open CASCADE workflows',
  brp: 'BREP online for Open CASCADE workflows',
  iges: 'IGES online for legacy CAD and surface exchange',
  igs: 'IGES online for legacy CAD and surface exchange',
  obj: 'OBJ online for visualization and mesh workflows',
  ply: 'PLY online for 3D scanning and colored meshes',
  stl: 'STL online for 3D printing and slicing',
  off: 'OFF online for computational mesh workflows',
  '3dm': '3DM online for Rhino and Grasshopper workflows',
  step: 'STEP online for mechanical CAD workflows',
  stp: 'STEP online for mechanical CAD workflows',
  dxf: 'DXF online for CAD, CAM and CNC exchange',
  dwg: 'DWG online for native AutoCAD editing',
};

function getConverterMetaToPhrase(to) {
  const key = String(to || '').toLowerCase();
  return CONVERTER_META_TO_PHRASE[key] || `${String(to || '').toUpperCase()} online`;
}

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
    if (!cadFile || !isCadViewerFormatSlug(cadFile)) return { title: 'Not Found' };
    const meta = getViewerPageMetadata(cadFile);
    if (!meta) return { title: 'Not Found' };

    return buildPageMetadata({
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      pageUrl: meta.canonicalUrl,
      extra: {
        alternates: { canonical: meta.canonicalUrl },
      },
    });
  }

  if (isConvert && converterTypes.some((type) => type.path === `/${conversion}`)) {
    const [from, to] = conversion.split('-to-');
    const fromUpper = from?.toUpperCase() ?? '';
    const toUpper = to?.toUpperCase() ?? '';
    const canonical = `/tools/convert-${conversion}`;
    const title = `Convert ${fromUpper} to ${toUpper} Online – Free up to 5 MB | Marathon OS`;
    const description = `Convert ${fromUpper} files to ${getConverterMetaToPhrase(to)}. Secure uploads, files up to 300 MB, free downloads under 5 MB, and no software required.`;

    return buildPageMetadata({
      title,
      description,
      canonicalPath: canonical,
    });
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
    if (!cadFile || !CAD_VIEWER_FORMAT_SLUGS.includes(cadFile)) return notFound();
    const meta = getViewerPageMetadata(cadFile);
    if (!meta) return notFound();

    const cadTypeLabel = `${String(cadFile).toUpperCase()} CAD Viewer`;

    return (
      <>
        <FaqPageJsonLd faqSchemaData={cadViewerFaqQuestions} />
        <ToolPageJsonLd
          name={meta.h1.replace(/^Free Online /, '')}
          url={meta.canonicalUrl}
          description={meta.description}
          breadcrumbLinks={[
            { label: 'Tools', href: '/tools' },
            { label: 'CAD Viewer', href: '/tools/3d-cad-viewer' },
            { label: cadTypeLabel },
          ]}
        />
        <CadHomeDesign type={true} cadType={cadFile} skipPageJsonLd skipBreadcrumbSchema />
      </>
    );
  }

  if (isConvert) {
    if (!converterTypes.some((type) => type.path === `/${conversion}`)) return notFound();
    const [from, to] = conversion.split('-to-');
    const fromUpper = from?.toUpperCase() ?? '';
    const toUpper = to?.toUpperCase() ?? '';
    const softwareName = `Free Online ${fromUpper} to ${toUpper} Converter`;
    const softwareUrl = `${BASE_URL}/tools/convert-${conversion}`;

    const converterFaqs = getConverterFaqQuestions(conversion);

    return (
      <>
        <FaqPageJsonLd faqSchemaData={converterFaqs} />
        <SoftwareApplicationJsonLd name={softwareName} url={softwareUrl} />
        <ConvertPairPage conversionParams={conversion} />
      </>
    );
  }

  return notFound();
}
