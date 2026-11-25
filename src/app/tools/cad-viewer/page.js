import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-viewer';

export const metadata = buildPageMetadata({
  title: 'Free Online CAD Viewer | STEP, STL, DXF, DWG and more | Marathon OS',
  description:
    'Preview CAD files online on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP, 3DM, DXF and DWG. No software required.',
  canonicalPath: '/tools/3d-cad-viewer',
  pageUrl: CANONICAL_URL,
  extra: {
    alternates: { canonical: CANONICAL_URL },
  },
});

function PartDesignViewer() {
  return <CadHomeDesign />;
}

export default PartDesignViewer;
