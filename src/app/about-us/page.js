export const metadata = {
  title: "About Us | Marathon OS",
  description:
    "Discover the story behind Marathon OS — a platform built to streamline hardware lifecycle management for engineering and manufacturing teams.",
  openGraph: {
    images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  metadataBase: new URL("https://marathon-os.com"),
  alternates: {
    canonical: "/about-us",
  },
};

import AboutUs from '@/Components/HomePages/AboutUs/AboutUs'
import React from 'react'

function AboutUsPage() {
  return (
    <AboutUs/>
  )
}

export default AboutUsPage