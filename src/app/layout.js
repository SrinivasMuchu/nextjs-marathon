import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import ToastProvider from "@/Components/CommonJsx/ReactToastify";
import CreateLocalStorage from "@/Components/CommonJsx/CreateLocalStorage";
import ContextWrapper from "@/Components/CommonJsx/ContextWrapper";

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
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />
        <link rel="apple-touch-icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />
        <link rel="shortcut icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" type="image/x-icon"></link>
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marathon-os.com" />
        <meta property="og:site_name" content="Marathon OS" />
        <link
          rel="icon"
          href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg"
        />
        <link
          rel="apple-touch-icon"
          href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg"
        />
        <link
          rel="shortcut icon"
          href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg"
          type="image/x-icon"
        />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="disable-ga"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname === "localhost") {
                window['ga-disable-${GA_TRACKING_ID}'] = true;
              }
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
        <ToastProvider />
        <CreateLocalStorage/>
        <ContextWrapper>
        {children}
        </ContextWrapper>
       
      </body>
    </html>
  );
}
