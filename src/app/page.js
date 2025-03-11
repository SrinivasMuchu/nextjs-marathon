export const metadata = {
  title: "Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing | Marathon OS",
  description:
    "Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains.",
  openGraph: {
    title: "Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing",
    description:
      "Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains.",
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
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Marathon OS",
  url: "https://marathon-os.com",
  image: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
  description:
    "Marathon OS is a cloud-based PLM, PDM, and BOM management platform designed for engineering teams and manufacturers. It streamlines CAD file management, inventory tracking, procurement, and real-time collaboration.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Product Lifecycle Management Software",
  operatingSystem: "Web-based",
  softwareVersion: "1.0.0",
  offers: {
    "@type": "Offer",
    price: "1500.00",
    priceCurrency: "INR",
    category: "Subscription",
    url: "https://marathon-os.com/#pricing",
  },
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

import { Inter } from "next/font/google";
import HomePage from "@/Components/Home/HomePage";
import Script from "next/script";
import styles from "./page.module.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className={`${styles["marathon"]} ${inter.className}`}>
        <HomePage />
      </div>
    </>
  );
}
