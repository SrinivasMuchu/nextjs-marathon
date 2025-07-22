
export const metadata = {
    title: "Privacy Policy | Marathon OS",
    description:
      "Learn how Marathon OS collects, uses, and protects your personal data. We value your privacy and are committed to safeguarding your information.",
      openGraph: {images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
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