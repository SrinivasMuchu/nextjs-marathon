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

export const metadata = {
  title: "Marathon OS ᐈ Cloud PDM, PLM, Bill Of Materials & Inventory Management for Engineering & Manufacturing",
  description: 
  "Marathon OS™ ☝ A powerful cloud-based PDM, PLM, and BOM management platform for engineering teams and manufacturers. ✔️ Simplify CAD file management, inventory tracking, procurement, and real-time collaboration across global supply chains.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://marathon-web-assets.s3.ap-south-1.amazonaws.com/m-logo.svg" /> 
        
        <title>{metadata.title}</title> 
        <meta name="description" content={metadata.description} />
        <meta property="og:locale" content="en_US" />
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      
    </html>
  );
}
