import { ASSET_PREFIX_URL } from "@/config";

export const metadata = {
    title: "Contact us | Marathon OS",
    description:
      "Have questions or need support? Contact the Marathon OS team for assistance with our hardware lifecycle management platform.",
      openGraph: {images: [
        {
          url: `${ASSET_PREFIX_URL}logo-1.png`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],} , metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: "/contact-us",
      },
  };
import ContactUs from '@/Components/HomePages/ContactUs/ContactUs';
import React from 'react'

export default function RefundPolicyPage() {
    return (
        <ContactUs />
    );
}