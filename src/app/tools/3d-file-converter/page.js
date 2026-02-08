import { ASSET_PREFIX_URL } from '@/config';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/3d-cad-file-converter';
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

export const metadata = {
  title: " Free Online 3D CAD File Converter (STEP, IGES, STL, OBJ) | Marathon OS",
  description:
    "Convert CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based conversion. No software required. ",
  openGraph: {
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL('https://marathon-os.com'),
  alternates: { canonical: '/tools/3d-cad-file-converter' },
};

function page() {
  return <CadFileConversionHome />;
}

export default page;
