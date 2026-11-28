import "./globals.css";
import Script from "next/script";
import { Inter, Roboto } from "next/font/google";
import ToastProvider from "@/Components/CommonJsx/ReactToastify";
import CreateLocalStorage from "@/Components/CommonJsx/CreateLocalStorage";
import ContextWrapper from "@/Components/CommonJsx/ContextWrapper";
import FloatingButton from "@/Components/CommonJsx/FloatingButton";
import FeedbackHost from "@/Components/Feedback/FeedbackHost";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import { ConverterPricingSeedProvider } from "@/Components/CadUploadingHome/CadFileConversion/ConverterPricingSeed";
import { getConverterPricingForRender } from "@/lib/converterPricingServer";
import AnnouncementBanner from "@/Components/HomePages/AnnouncementBanner/AnnouncementBanner";
import { CadFormProvider } from "@/Components/CadServicePages/CadFormContext";
import { ASSET_PREFIX_URL, GOOGLE_ADSENSE_CLIENT_ID } from "@/config";
import AdSenseScript from "@/Components/CommonJsx/Adsense/AdSenseScript";



const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true, // Reduces layout shift with fallback font metrics
});

// Load Roboto with font-display: swap to prevent MUI from loading it from Google Fonts CDN
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  adjustFontFallback: true,
});

const GA_TRACKING_ID = "G-6P47TN4FMC";
const LINKEDIN_PARTNER_ID = "9449508";
const BASE_URL = "https://marathon-os.com";

// A raw og:url in <head> is not part of the Metadata API merge, so it stayed
// on every page (and disagreed with pages that set openGraph.url). "./" resolves
// to the current path on the canonical host. A page openGraph object replaces this.
export const metadata = {
  metadataBase: new URL(BASE_URL),
  openGraph: {
    url: "./",
    type: "website",
    siteName: "Marathon OS",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Marathon OS",
  url: `${BASE_URL}/`,
  logo: `${ASSET_PREFIX_URL}logo-1.png`,
  image: `${ASSET_PREFIX_URL}logo-1.png`,
    description: "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP, IGES, STL, DXF and DWG online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
    sameAs: ["https://www.linkedin.com/company/marathon-os"],
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Marathon OS",
  "url": `${BASE_URL}/`,
  "applicationCategory": "DesignApplication",
  "operatingSystem": "Any (web browser)",
  "description": "Online CAD tools to convert STEP, STL, 3MF, IGES, OBJ, 3DM, BREP, PLY, OFF, DXF and DWG files, view CAD models in 3D, extract a BOM and turn STEP models into 2D drawings.",
  "offers": [
    {
      "@type": "Offer",
      "name": "First 2 file conversions",
      "price": "0",
      "priceCurrency": "USD",
    },
    {
      "@type": "Offer",
      "name": "Single conversion download",
      "price": "2.99",
      "priceCurrency": "USD",
    },
    {
      "@type": "Offer",
      "name": "STEP to 2D drawing set",
      "price": "5.99",
      "priceCurrency": "USD",
    },
  ],
  "publisher": { "@id": `${BASE_URL}/#organization` },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/`,
  name: "Marathon OS",
  url: `${BASE_URL}/`,
  description: "Marathon OS™ ☝ Explore downloadable CAD designs, open STEP, IGES, STL, DXF and DWG online and convert files fast with Marathon OS. Simple tools, quick previews, zero clutter.",
  publisher: { "@id": `${BASE_URL}` },
  inLanguage: "en-US",
};

export default async function RootLayout({ children }) {
  // Cached 5 min; lets converter widgets render real prices in the server HTML.
  const { pricingInfo } = await getConverterPricingForRender();

  return (
    <html lang="en" > 
      <head>
        {/* DNS prefetch and preconnect for faster resource loading */}
        <link rel="dns-prefetch" href="https://marathon-os.com" />
        <link rel="preconnect" href="https://marathon-os.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />

        <link rel="apple-touch-icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" />
        <link rel="shortcut icon" href="https://d2o2bcehk92sin.cloudfront.net/m-logo.svg" type="image/x-icon"></link>
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={`${ASSET_PREFIX_URL}logo-1.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
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
          id="strip-feedback-token"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function () {
        try {
          var url = new URL(window.location.href);
          if (!url.searchParams.has("t")) return;
          if (url.pathname.indexOf("/feedback/rate") === 0) {
            sessionStorage.setItem("feedback_rate_t", url.searchParams.get("t") || "");
            var star = url.searchParams.get("r");
            if (star) sessionStorage.setItem("feedback_rate_r", star);
            var src = url.searchParams.get("s");
            if (src) sessionStorage.setItem("feedback_rate_s", src);
          }
          url.searchParams.delete("t");
          var next = url.pathname + (url.search ? url.search : "") + url.hash;
          history.replaceState(history.state, "", next);
        } catch (e) {}
      })();
    `,
          }}
        />

        {/*
          Tracking runs only on the live site. testing.marathon-os.com, OVH hosts and
          localhost load neither GA4 nor Clarity, so test sessions and test payments
          stay out of the live projects. Keep this list in sync with TRACKING_HOSTS
          in common.helper.js.
        */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      (function () {
        var h = window.location.hostname;
        if (h !== "marathon-os.com" && h !== "www.marathon-os.com") return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){dataLayer.push(arguments);};
        gtag('js', new Date());
        var loc = new URL(window.location.href);
        loc.searchParams.delete('t');
        gtag('config', '${GA_TRACKING_ID}', {
          page_path: loc.pathname,
          page_location: loc.origin + loc.pathname + loc.search + loc.hash,
        });
        function load() {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}';
          document.head.appendChild(s);
        }
        if (document.readyState === 'complete') load();
        else window.addEventListener('load', load);
      })();
    `,
          }}
        />

        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
    (function (h) {
      if (h !== "marathon-os.com" && h !== "www.marathon-os.com") return;
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "rmu78moi7c");
    })(window.location.hostname);
    `,
          }}
        />
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
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <Script
          id="json-ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

      </head>

      <body className={`${inter.variable} ${roboto.variable}`}>
        <ToastProvider />
        <CreateLocalStorage />
        <AdSenseScript />
        <ContextWrapper>
          <CadFormProvider>
            <div className="siteStickyHeader">
              <AnnouncementBanner />
              <HomeTopNav />
            </div>
            <main role="main">
              <ConverterPricingSeedProvider pricingInfo={pricingInfo}>{children}</ConverterPricingSeedProvider>
            </main>
            <FloatingButton />
            <FeedbackHost />
          </CadFormProvider>
        </ContextWrapper>
      </body>
    </html>
  );
}
