import { ASSET_PREFIX_URL } from '@/config';
import OrgHome from '@/Components/OrganizationHome/OrgHome';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/org-hierarchy';
const pageUrl = `${BASE_URL}${CANONICAL_PATH}`;
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;



export const metadata = {
  title: "Free Org Chart Creator | Best Online Organizational Chart Maker | Marathon OS",
  description:
    "Create professional organizational charts effortlessly with our free Org Chart Creator. Customize and visualize team structures with an easy-to-use online chart maker. Try it now!",
  openGraph: {
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: 'image/png' }],
  },
  metadataBase: new URL('https://marathon-os.com'),
  alternates: { canonical: '/tools/org-hierarchy' },
};

function Org() {
  return (
    <>
     
      <OrgHome />
    </>
  );
}

export default Org;