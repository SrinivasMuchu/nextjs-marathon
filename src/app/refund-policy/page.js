import { ASSET_PREFIX_URL } from '@/config';

export const metadata = {
    title: "Refund Policy | Marathon OS",
    description:
      "Read Marathon OS's refund policy to understand our terms for subscription cancellations, refunds, and dispute resolution for digital purchases.",
 
      openGraph: {images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],} , metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: "/refund-policy",
      },
  };
import RefundPolicy from '@/Components/TermsAndConditions/RefundPolicy';
import React from 'react'

export default function RefundPolicyPage() {
    return (
        <RefundPolicy />
    );
}