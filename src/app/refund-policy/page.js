
export const metadata = {
    title: "Refund Policy | Marathon OS",
    description:
      "Read Marathon OS's refund policy to understand our terms for subscription cancellations, refunds, and dispute resolution for digital purchases.",
 
      openGraph: {images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
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