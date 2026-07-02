import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const CANONICAL_URL = 'https://marathon-os.com/tools/3d-cad-viewer';

export const metadata = buildPageMetadata({
  title: 'Free Online 3D CAD Viewer | STEP, IGES, STL, OBJ | Marathon OS',
  description:
    'Preview CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.',
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
