import { ASSET_PREFIX_URL } from '@/config';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/3d-cad-file-converter';
const pageUrl = `${BASE_URL}${CANONICAL_PATH}`;
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#webapp`,
      name: 'Marathon OS 3D File Converter',
      alternateName: 'Free Online 3D File Converter',
      description: 'Convert CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based conversion. No software required.',
      url: pageUrl,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Convert STEP, IGES, STL, OBJ, PLY, OFF, BREP, DWG, DXF',
        'No software installation required',
        'Upload up to 300 MB',
        'Files encrypted and automatically deleted after 24 hours',
      ],
      image: imageUrl,
      author: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL },
      publisher: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL, logo: imageUrl },
      sameAs: ['https://www.linkedin.com/company/marathon-os'],
    },
  ],
};

export const metadata = {
  title: ' Free Online 3D CAD File Converter (STEP, IGES, STL, OBJ) | Marathon OS',
  description:
    'Convert CAD & 3D model files online in seconds on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based conversion. No software required.',
  openGraph: {
    images: [{ url: imageUrl, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

function page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <CadFileConversionHome />
    </>
  );
}

export default page;
