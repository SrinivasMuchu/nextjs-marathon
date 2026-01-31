import { ASSET_PREFIX_URL } from '@/config';

export const metadata = {
    title: "Terms and Conditions | Marathon OS",
    description:
    "Review the terms and conditions for using Marathon OS. Understand your rights, responsibilities, and the rules that govern access to our platform.",
      openGraph: {images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
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