export const metadata = {
  title: "STEP File Viewer – View & Explore .STEP and .STP Files Online | Marathon OS",
  description:
    "Marathon OS CAD Viewer is a high-performance, cloud-based tool that lets you view STEP, IGES, STL, BREP, and more instantly—no downloads, no lag, no limits. Experience seamless, glitch-free CAD visualization with our proprietary rendering engine, ensuring smooth performance even for large and complex models. Try it now!",
    robots: "noindex, nofollow",
    openGraph: {images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],} , metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: "/tools/cad-renderer",
    },
};
import PartDesignView from '@/Components/PDMViewer/PartDesignView'
import React from 'react'

function DesignView() {
  return (
    <PartDesignView/>
  )
}

export default DesignView