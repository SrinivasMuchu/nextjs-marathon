import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import ToastProvider from "@/Components/CommonJsx/ReactToastify";
import CreateLocalStorage from "@/Components/CommonJsx/CreateLocalStorage";
import ContextWrapper from "@/Components/CommonJsx/ContextWrapper";
import FloatingButton from "@/Components/CommonJsx/FloatingButton";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/config";



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
    <html lang="en" >
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
        <meta name="google-adsense-account" content={GOOGLE_ADSENSE_CLIENT_ID} />
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
          strategy="beforeInteractive"
          id="disable-ga-on-localhost"
          dangerouslySetInnerHTML={{
            __html: `
      if (window.location.hostname === "localhost") {
        window['ga-disable-${GA_TRACKING_ID}'] = true;
      }
    `,
          }}
        />

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

        {/* <Script
  id="microsoft-clarity"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      if (window.location.hostname !== "localhost") {
        (function(c,l,a,r,i,t,y){
          c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
          t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
          y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "rmu78moi7c");
      }
    `,
  }}
/> */}
        {/* <Script
          id="adsense-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (window.location.hostname !== "localhost") {
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={GOOGLE_ADSENSE_CLIENT_ID}';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              }
            `,
          }}
        /> */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
     data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}></script>

        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

      </head>

      <body className={inter.variable}>
        <ToastProvider />
        <CreateLocalStorage />
        <ContextWrapper>
          <HomeTopNav/>
          <main role="main">
            {children}
          </main>
          <FloatingButton />
        </ContextWrapper>
      </body>
    </html>
  );
}
