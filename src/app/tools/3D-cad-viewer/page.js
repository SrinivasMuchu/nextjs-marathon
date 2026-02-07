import { ASSET_PREFIX_URL } from '@/config';
import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/3D-cad-viewer';
const pageUrl = `${BASE_URL}${CANONICAL_PATH}`;
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Marathon OS",
  url: pageUrl,
  image: imageUrl,
  description:
    "Preview CAD & 3D model files online in seconds only on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "The CAD marketplace for modern teams",
  operatingSystem: "Web-based",
  softwareVersion: "1.0.0",
  publisher: {
    "@type": "Organization",
    name: "Marathon OS",
    url: BASE_URL,
    logo: imageUrl,
  },
  author: {
    "@type": "Organization",
    name: "Marathon OS",
    url: BASE_URL,
  },
  sameAs: ["https://www.linkedin.com/company/marathon-os"],
};

export const metadata = {
  title: " Free Online 3D CAD Viewer (STEP, IGES, STL, OBJ) | Marathon OS",
  description:
    "Preview CAD & 3D model files online in seconds only on Marathon OS. Upload STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP. Fast, secure, cloud-based viewer. No software required.",
  openGraph: {
    images: [
      { url: imageUrl, width: 1200, height: 630, type: "image/png" },
    ],
  },
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: CANONICAL_PATH },
};

function PartDesignViewer() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <CadHomeDesign />
    </>
  );
}

export default PartDesignViewer;
