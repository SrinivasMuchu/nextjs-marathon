export const metadata = {
  title: "Free Org Chart Creator | Best Online Organizational Chart Maker",
  description:
    "Create professional organizational charts effortlessly with our free Org Chart Creator. Customize and visualize team structures with an easy-to-use online chart maker. Try it now!",
    robots: "noindex, nofollow",
    openGraph: {images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],} 
  };

import Hierarchy from "@/Components/HierarchyComponent/Hierarchy";
import React from "react";

export default function OrgHierarchy() {
  return <Hierarchy />;
}
