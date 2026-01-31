import { ASSET_PREFIX_URL } from '@/config';

export const metadata = {
  title: "Free Org Chart Creator | Best Online Organizational Chart Maker | Marathon OS",
  description:
    "Create professional organizational charts effortlessly with our free Org Chart Creator. Customize and visualize team structures with an easy-to-use online chart maker. Try it now!",
    openGraph: {images: [
      {
        url: `${ASSET_PREFIX_URL}logo-1.png`,
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],} , metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: "/tools/org-hierarchy", 
    },
};

import OrgHome from '@/Components/OrganizationHome/OrgHome'
import React from 'react'

function Org() {
  
  return (
   
      <OrgHome />

    

  )
}

export default Org