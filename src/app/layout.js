import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

const GA_TRACKING_ID = "G-6P47TN4FMC";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Marathon OS",
  "url": "https://marathon-os.com",
  "image": "https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg",
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
    "logo": "https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg"
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
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Inter:wght@400;700&display=swap" 
          as="style" 
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Inter:wght@400;700&display=swap" />
        </noscript>
        <link rel="apple-touch-icon" href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" />
        <link rel="shortcut icon" href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" type="image/x-icon"></link>
        <title>{metadata.title}</title> 
        <meta name="description" content={metadata.description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing" />
        <meta property="og:description" content="Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains." />
        <meta property="og:url" content="https://www.marathon-os.com" />
        <meta property="og:site_name" content="Marathon OS" />
        <Script
          strategy="afterInteractive"
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      
    </html>
  );
}
