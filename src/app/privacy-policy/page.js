import { ASSET_PREFIX_URL } from '@/config';

export const metadata = {
    title: "Privacy Policy | Marathon OS",
    description:
      "Learn how Marathon OS collects, uses, and protects your personal data. We value your privacy and are committed to safeguarding your information.",
      openGraph: {images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },  
      ],} , metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: "/privacy-policy",
      },
  };
import PrivacyPolicy from '@/Components/TermsAndConditions/PrivacyPolicy'
import React from 'react'

export default function PrivacyPolicyPage() {
    return(
        <PrivacyPolicy/>
    )
}