import { ASSET_PREFIX_URL } from '@/config';
import OrgHome from '@/Components/OrganizationHome/OrgHome';
import React from 'react';

const BASE_URL = 'https://marathon-os.com';
const CANONICAL_PATH = '/tools/org-hierarchy';
const pageUrl = `${BASE_URL}${CANONICAL_PATH}`;
const imageUrl = `${ASSET_PREFIX_URL}logo-1.png`;

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#webapp`,
      name: 'Marathon OS Org Chart Creator',
      alternateName: 'Free Online Organizational Chart Maker',
      description: 'Create professional organizational charts effortlessly with our free Org Chart Creator. Customize and visualize team structures with an easy-to-use online chart maker.',
      url: pageUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      
      image: imageUrl,
      publisher: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL, logo: imageUrl },
      author: { '@type': 'Organization', name: 'Marathon OS', url: BASE_URL },
      sameAs: ["https://www.linkedin.com/company/marathon-os"],
    },
      
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <OrgHome />
    </>
  );
}

export default Org;