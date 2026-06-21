import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import StickyCadStrip from '@/Components/CadServicesBanners/StickyCadStrip';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/3d-cad-file-converter';
const TITLE = 'Free Online 3D CAD File Converter (STEP, IGES, STL, OBJ) | Marathon OS';
const DESCRIPTION =
  'Convert CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based conversion. No software required.';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: CANONICAL_PATH,
});

function page() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="Free Online 3D CAD File Converter"
        url={`${BASE_URL}${CANONICAL_PATH}`}
        description="Convert STEP, IGES, STL, OBJ, PLY, OFF, and BREP files online with no software installation."
      />
      <CadFileConversionHome />
      <StickyCadStrip />
    </>
  );
}

export default page;
