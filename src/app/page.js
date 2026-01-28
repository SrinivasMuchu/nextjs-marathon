export const metadata = {
  title: "CAD Design Library + Free CAD Viewer & 3D Converter | Marathon OS",
  description:
    "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
  keywords: "CAD model library, CAD models download, free CAD models, online CAD viewer, 3D file converter, STEP viewer online, IGES viewer online, STL viewer online, STEP to STL, IGES to STEP, STL to OBJ, engineering CAD models, mechanical CAD files, 3D CAD designs",
  openGraph: {
    title: "CAD Design Library + Free CAD Viewer & 3D Converter | Marathon OS",
    description:
      "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
    url: "https://www.marathon-os.com",
    siteName: "Marathon OS",
    images: [
      {
        url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",

  },metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: "/", 
    },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Marathon OS",
  url: "https://marathon-os.com",
  image: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
  description:
    "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "The CAD marketplace for modern teams",
  operatingSystem: "Web-based",
  softwareVersion: "1.0.0",
  // offers: {
  //   "@type": "Offer",
  //   price: "1500.00",
  //   priceCurrency: "INR",
  //   category: "Subscription",
  //   url: "https://marathon-os.com/#pricing",
  // },
  publisher: {
    "@type": "Organization",
    name: "Marathon OS",
    url: "https://marathon-os.com",
    logo: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
  },
  author: {
    "@type": "Organization",
    name: "Marathon OS",
    url: "https://marathon-os.com",
  },
  sameAs: ["https://www.linkedin.com/company/marathon-os"],
};

import HomePage from "@/Components/Home/HomePage";
import Script from "next/script";
import styles from "./page.module.css";

export default function Home() {
  
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className={styles["marathon"]}>
        <HomePage />
      </div>
    </>
  );
}
