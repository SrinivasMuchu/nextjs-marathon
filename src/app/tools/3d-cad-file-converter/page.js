import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import ToolPageJsonLd from '@/Components/JsonLdSchemas/ToolPageJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-file-converter';
const TITLE = 'Free Online CAD File Converter | STEP, STL, IGES, OBJ, 3DM | Marathon OS';
const DESCRIPTION =
  'Convert CAD and 3D files online between STEP, STL, IGES, OBJ, PLY, BREP, 3DM, DWG and DXF. Secure browser-based conversion with 300 MB uploads and auto-delete in 24 hours.';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
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
        name="Free Online 3D CAD File Converter"
        url={CANONICAL_URL}
        description="Convert STEP, STL, IGES, OBJ, PLY, BREP, 3DM, DWG and DXF files online with no software installation."
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
