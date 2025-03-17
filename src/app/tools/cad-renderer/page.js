
export const metadata = {
  title: "View & Explore CAD Files Online | FreeCAD-Powered 3D Viewer | Marathon OS",
  description:
    "Render and explore CAD files online with our FreeCAD-powered 3D viewer. No downloads neede: view parts, assemblies, and designs seamlessly in your browser. Perfect for automotive, battery manufacturing, and hardware industries.",
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