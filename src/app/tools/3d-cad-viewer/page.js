import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import ToolPageJsonLd from '@/Components/JsonLdSchemas/ToolPageJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { getUniqueViewerPage } from '@/data/viewerUniquePages';
import React from 'react';

const uniquePage = getUniqueViewerPage(null, { isHub: true });
const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-viewer';
const TITLE =
  uniquePage?.meta?.title ||
  'Free Online CAD Viewer | STEP, STL, DXF, DWG and more | Marathon OS';
const DESCRIPTION =
  uniquePage?.meta?.description ||
  'Open STEP, IGES, STL, OBJ, PLY, OFF, BREP, 3DM, 3MF, DXF and DWG files online. Private browser-based viewing, with no CAD software required.';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: '/tools/3d-cad-viewer',
  pageUrl: CANONICAL_URL,
  extra: {
    alternates: { canonical: CANONICAL_URL },
  },
});

function PartDesignViewer() {
  return (
    <>
      <ToolPageJsonLd
        name={uniquePage?.h1 || 'Free Online 3D CAD Viewer'}
        url={CANONICAL_URL}
        description={DESCRIPTION}
        breadcrumbLinks={[
          { label: 'Tools', href: '/tools' },
          { label: uniquePage?.breadcrumbLabel || 'CAD Viewer' },
        ]}
      />
      <CadHomeDesign skipBreadcrumbSchema />
      <StickyCadStrip />
    </>
  );
}

export default PartDesignViewer;
