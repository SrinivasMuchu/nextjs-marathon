import React from 'react'
import CadServices from '@/Components/CadServicePages/CadServices'

export const metadata = {
  title: 'Expert CAD Outsourcing Services — Get Designs in 24 Hours | Marathon OS',
  description:
    'Vetted CAD designers on demand. Get SolidWorks, AutoCAD, Revit & Fusion 360 files delivered in 24 hrs. No hiring, no overhead. Get a quote today on Marathon OS',
  openGraph: {
    images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  metadataBase: new URL("https://marathon-os.com"),
  alternates: {
    canonical: "/cad-services",
  },
}

function page() {
  return (
    <div>
        <CadServices /> 
    </div>
  )
}

export default page