import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import React from 'react';

const CANONICAL_PATH = '/tools/3d-cad-file-converter';

export const metadata = buildPageMetadata({
  title: 'Free Online 3D CAD File Converter (STEP, IGES, STL, OBJ) | Marathon OS',
  description:
    'Convert CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based conversion. No software required.',
  canonicalPath: CANONICAL_PATH,
});

function page() {
  return <CadFileConversionHome />;
}

export default page;
