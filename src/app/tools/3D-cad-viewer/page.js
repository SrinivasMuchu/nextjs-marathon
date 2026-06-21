import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/3D-cad-viewer';
const TITLE = 'Free Online 3D CAD Viewer (STEP, IGES, STL, OBJ) | Marathon OS';
const DESCRIPTION =
  'Preview CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: CANONICAL_PATH,
});

function PartDesignViewer() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="Free Online 3D CAD Viewer"
        url={`${BASE_URL}${CANONICAL_PATH}`}
        description="Preview STEP, IGES, STL, OBJ, PLY, OFF, and BREP files online with no software installation."
      />
      <CadHomeDesign />
      <StickyCadStrip />
    </>
  );
}

export default PartDesignViewer;
