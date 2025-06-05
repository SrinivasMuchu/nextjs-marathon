export const metadata = {
    title: " CAD Dashboard | View, Convert, and Manage Files | Marathon OS",
    description:
        "Access your complete CAD file history in one dashboard. View files, convert formats, and manage published designs—all in a unified engineering workspace on Marathon OS.",
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
        canonical: "/dashboard",
    },
     robots: 'noindex, nofollow',
};
import FileHistoryHomePage from '@/Components/History/FileHistoryHomePage'
import React from 'react'

function History() {
  return (
  <FileHistoryHomePage />
  )
}

export default History
