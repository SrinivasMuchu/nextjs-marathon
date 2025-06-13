export const metadata = {
  title: "Upload Your CAD Designs | Inspire, Share, and Collaborate | Marathon-OS",
  description:
    "Easily upload and share your CAD designs. Showcase your work, connect with like-minded professionals, and get regular updates on how your designs are performing. Be a part of the growing community of engineers and makers on Marathon-OS.",
  openGraph: {
    images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  }, metadataBase: new URL("https://marathon-os.com"),
  alternates: {
    canonical: "/publish-cad",
  },
};


import React from 'react'
import UserCadFileUpload from '@/Components/UserCadFileCreation/UserCadFileUpload';

function PublishCad() {
  return (
    <>
      <UserCadFileUpload />
    </>
  )
}

export default PublishCad
