export const metadata = {
    title: "Terms and Conditions | Marathon OS",
    description:
      "Terms and conditions",
      openGraph: {images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],} , metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: "/terms-and-conditions",
      },
  };
import TermsAndCondition from '@/Components/TermsAndConditions/TermsAndConditions'
import React from 'react'

export default function TermsAndConditionsPage() {
    return (
        <TermsAndCondition />
    );
}