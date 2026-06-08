import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Inter, Roboto } from "next/font/google";
import ContextWrapper from "@/Components/CommonJsx/ContextWrapper";
import FloatingButton from "@/Components/CommonJsx/FloatingButton";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import { CadFormProvider } from "@/Components/CadServicePages/CadFormContext";
import { ADSENSE_ENABLED, ASSET_PREFIX_URL, GOOGLE_ADSENSE_CLIENT_ID } from "@/config";

const ToastProvider = dynamic(() => import("@/Components/CommonJsx/ReactToastify"), { ssr: false });
const CreateLocalStorage = dynamic(() => import("@/Components/CommonJsx/CreateLocalStorage"), { ssr: false });
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false,
  adjustFontFallback: true,
});
const GA_TRACKING_ID = "G-6P47TN4FMC";
const LINKEDIN_PARTNER_ID = "9449508";
const BASE_URL = "https://marathon-os.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Marathon OS",
  url: `${BASE_URL}/`,
  logo: `${ASSET_PREFIX_URL}logo-1.png`,
  image: `${ASSET_PREFIX_URL}logo-1.png`,
    description: "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
    sameAs: ["https://www.linkedin.com/company/marathon-os"],
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Marathon OS",
  "url": "https://marathon-os.com",
  "image": `${ASSET_PREFIX_URL}logo-1.png`,
  "description": "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
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
    "logo": `${ASSET_PREFIX_URL}logo-1.png`
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/`,
  name: "Marathon OS",
  url: `${BASE_URL}/`,
  description: "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP/IGES/STL online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
  publisher: { "@id": `${BASE_URL}` },
  inLanguage: "en-US",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" > 
      <head>
        {/* DNS prefetch and preconnect for faster resource loading */}
        <link rel="dns-prefetch" href="https://marathon-os.com" />
        <link rel="preconnect" href="https://marathon-os.com" crossOrigin="anonymous" />

        <link rel="icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />

        <link rel="apple-touch-icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />
        <link rel="shortcut icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" type="image/x-icon"></link>
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={`${ASSET_PREFIX_URL}logo-1.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.marathon-os.com" />
        <meta property="og:site_name" content="Marathon OS" />
        {ADSENSE_ENABLED ? (
          <meta name="google-adsense-account" content={GOOGLE_ADSENSE_CLIENT_ID} />
        ) : null}
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
          strategy="afterInteractive"
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
        {ADSENSE_ENABLED ? (
          <Script
            id="google-adsense"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        ) : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

      </head>

      <body className={`${inter.className} ${inter.variable} ${roboto.variable}`}>
        <ToastProvider />
        <CreateLocalStorage />
        <ContextWrapper>
          <CadFormProvider>
            <HomeTopNav />
            <main role="main">{children}</main>
            <FloatingButton />
          </CadFormProvider>
        </ContextWrapper>
      </body>
    </html>
  );
}
