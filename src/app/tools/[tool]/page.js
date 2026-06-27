import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd';
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
    if (!cadFile || !CAD_VIEWER_FORMAT_SLUGS.includes(cadFile)) return notFound();
    const meta = getViewerPageMetadata(cadFile);
    if (!meta) return notFound();

    return (
      <>
        <FaqPageJsonLd faqSchemaData={cadViewerFaqQuestions} />
        <SoftwareApplicationJsonLd
          name={meta.h1.replace(/^Free Online /, '')}
          url={meta.canonicalUrl}
          description={meta.description}
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
