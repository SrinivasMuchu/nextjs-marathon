import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import { getConverterFaqQuestions, cadViewerFaqQuestions } from '@/data/cadToolFaqs';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
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
    const cadUpper = cadFile.toUpperCase();
    const title = `${cadUpper} File Viewer – Instantly Open & Explore ${cadUpper} Files`;
    const description = `View ${cadUpper} (${cadFile}) files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds.`;
    return buildPageMetadata({
      title,
      description,
      canonicalPath: `/tools/${cadFile}-file-viewer`,
    });
  }

  if (isConvert && converterTypes.some((type) => type.path === `/${conversion}`)) {
    const [from, to] = conversion.split('-to-');
    const fromUpper = from?.toUpperCase() ?? '';
    const toUpper = to?.toUpperCase() ?? '';
    const canonical = `/tools/convert-${conversion}`;
    const title = `Free Online ${fromUpper} to ${toUpper} Converter | Marathon OS`;
    const description = `Convert ${fromUpper} files to ${toUpper} online with Marathon OS. Fast, secure CAD file conversion with no software installation required.`;

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
    if (!cadFile || !ALLOWED_CAD_FILES.includes(cadFile)) return notFound();
    const cadUpper = cadFile.toUpperCase();
    const softwareName = `${cadUpper} File Viewer`;
    const softwareUrl = `${BASE_URL}/tools/${cadFile}-file-viewer`;

    return (
      <>
        <FaqPageJsonLd faqSchemaData={cadViewerFaqQuestions} />
        <SoftwareApplicationJsonLd
          name={softwareName}
          url={softwareUrl}
          description={`View ${cadUpper} files online with Marathon OS. No software installation required.`}
        />
        <CadHomeDesign type={true} cadType={cadFile} skipPageJsonLd />
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
        <CadFileConversionHome convert={true} conversionParams={conversion} skipPageJsonLd />
      </>
    );
  }

  return notFound();
}
