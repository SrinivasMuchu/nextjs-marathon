
export const metadata = {
    title: "Contact us | Marathon OS",
    description:
      "Have questions or need support? Contact the Marathon OS team for assistance with our hardware lifecycle management platform.",
      openGraph: {images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
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