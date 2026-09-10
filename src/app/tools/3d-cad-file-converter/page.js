import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import ToolPageJsonLd from '@/Components/JsonLdSchemas/ToolPageJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage';
import React from 'react';

const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-file-converter';

export const metadata = buildPageMetadata({
  title: CONVERTER_HUB_PAGE.meta.title,
  description: CONVERTER_HUB_PAGE.meta.description,
  canonicalPath: '/tools/3d-cad-file-converter',
  pageUrl: CANONICAL_URL,
  extra: {
    alternates: { canonical: CANONICAL_URL },
  },
});

function page() {
  return (
    <>
      <ToolPageJsonLd
        name="Free online 3D CAD file converter"
        url={CANONICAL_URL}
        description={CONVERTER_HUB_PAGE.meta.description}
        breadcrumbLinks={[
          { label: 'Tools', href: '/tools' },
          { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
        ]}
      />
      <CadFileConversionHome skipBreadcrumbSchema />
      <StickyCadStrip />
    </>
  );
}

export default page;
