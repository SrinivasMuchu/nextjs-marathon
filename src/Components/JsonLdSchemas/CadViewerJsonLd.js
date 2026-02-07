import React from 'react';
import { ASSET_PREFIX_URL } from '@/config';

const DEFAULT_BASE_URL = 'https://marathon-os.com';
const DEFAULT_CANONICAL_PATH = '/tools/cad-viewer';

function CadViewerJsonLd({ canonicalPath = DEFAULT_CANONICAL_PATH, baseUrl = DEFAULT_BASE_URL }) {
  const pageUrl = `${baseUrl}${canonicalPath}`;
  const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}#webapp`,
        name: 'Marathon OS CAD Viewer',
        alternateName: 'Free Online 3D CAD Viewer',
        description: 'Preview CAD & 3D model files online in seconds. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.',
        url: pageUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'View STEP, IGES, STL, OBJ, PLY, OFF, BREP files in browser',
          'No software installation required',
          'Drag & drop upload',
          'Files encrypted and automatically deleted after 24 hours',
          'Upload files up to 300 MB',
        ],
        screenshot: imageUrl,
        image: imageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Marathon OS',
          url: baseUrl,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        name: 'Free Online 3D CAD Viewer (STEP, IGES, STL, OBJ) | Marathon OS',
        description: 'Preview CAD & 3D model files online in seconds only on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.',
        url: pageUrl,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`,
          name: 'Marathon OS',
          url: baseUrl,
        },
        about: { '@id': `${pageUrl}#webapp` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export default CadViewerJsonLd;
