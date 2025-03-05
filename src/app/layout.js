
import "./globals.css";
import Script from "next/script";
import { Inter } from 'next/font/google';
import ToastProvider from "@/Components/CommonJsx.js/ReactToastify";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const GA_TRACKING_ID = "G-6P47TN4FMC";


const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Marathon OS",
  "url": "https://marathon-os.com",
  "image": "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
  "description": "Marathon OS is a cloud-based PLM, PDM, and BOM management platform designed for engineering teams and manufacturers. It streamlines CAD file management, inventory tracking, procurement, and real-time collaboration.",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Product Lifecycle Management Software",
  "operatingSystem": "Web-based",
  "softwareVersion": "1.0.0",
  "offers": {
    "@type": "Offer",
    "price": "1500.00",
    "priceCurrency": "INR",
    "category": "Subscription",
    "url": "https://marathon-os.com/#pricing"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Marathon OS",
    "url": "https://marathon-os.com",
    "logo": "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png"
  },
  "author": {
    "@type": "Organization",
    "name": "Marathon OS",
    "url": "https://marathon-os.com"
  },
  "sameAs": [
    "https://www.linkedin.com/company/marathon-os"
  ]
};
export const metadata = {
  title: "Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing",
  description:
    "Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" />
        <link rel="apple-touch-icon" href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" />
        <link rel="shortcut icon" href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" type="image/x-icon"></link>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing" />
        <meta property="og:description" content="Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains." />
        <meta property="og:url" content="https://www.marathon-os.com" />
        <meta property="og:site_name" content="Marathon OS" />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      </head>
      <body className={inter.variable}>
        <ToastProvider/>
        {children}
      </body>

    </html>
  );
}
