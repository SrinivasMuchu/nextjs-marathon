import { ASSET_PREFIX_URL } from '@/config';

export const metadata = {
  title: "Marathon OS CAD Viewer – Instantly View 3D CAD Files Online | Marathon OS",
  description:
    "Marathon OS CAD Viewer is a high-performance, cloud-based tool that lets you view STEP, IGES, STL, BREP, and more instantly—no downloads, no lag, no limits. Experience seamless, glitch-free CAD visualization with our proprietary rendering engine, ensuring smooth performance even for large and complex models. Try it now!",
    openGraph: {images: [
      {
        url: `${ASSET_PREFIX_URL}logo-1.png`,
        width: 1200,
        height: 630,  
        type: "image/png",
      },
    ],} , metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: "/tools/cad-viewer",
    },
};
import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign'
import React from 'react'

function PartDesignViewer() {
  return (
    <CadHomeDesign />
  )
}

export default PartDesignViewer