import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import ToastProvider from "@/Components/CommonJsx/ReactToastify";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const GA_TRACKING_ID = "G-6P47TN4FMC";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg"
        />
        <link
          rel="apple-touch-icon"
          href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg"
        />
        <link
          rel="shortcut icon"
          href="https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/m-logo.svg"
          type="image/x-icon"
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
      </head>
      <body className={inter.variable}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
