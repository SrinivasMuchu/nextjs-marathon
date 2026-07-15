import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import ToolPageJsonLd from '@/Components/JsonLdSchemas/ToolPageJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-viewer';
const TITLE = 'Free Online 3D CAD Viewer | STEP, IGES, STL, OBJ, 3DM | Marathon OS';
const DESCRIPTION =
  'Preview CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP, 3DM. Fast, secure, cloud-based viewer. No software required.';

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
        name="Free Online 3D CAD Viewer"
        url={CANONICAL_URL}
        description="Preview STEP, IGES, STL, OBJ, PLY, OFF, BREP, and 3DM files online with no software installation."
        breadcrumbLinks={[
          { label: 'Tools', href: '/tools' },
          { label: 'CAD Viewer', href: '/tools/3d-cad-viewer' },
        ]}
      />
      <CadHomeDesign skipBreadcrumbSchema />
      <StickyCadStrip />
    </>
  );
}

export default PartDesignViewer;
