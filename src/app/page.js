import { ASSET_PREFIX_URL } from "@/config";

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
        url: `${ASSET_PREFIX_URL}logo-1.png`,
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

/** FAQ items as plain text for FAQPage schema (must match visible content on page) */
const faqSchemaData = [
  { question: "What is MarathonOS?", answer: "MarathonOS is a marketplace where CAD designers sell CAD designs to engineers, agencies, and organizations. Buyers can discover designs, purchase securely, and download instantly." },
  { question: "How do I publish a CAD file?", answer: 'Go to your dashboard and click "Upload CAD File." Upload your file, add a title, description, previews, and pricing, then click "Publish" to list it on the marketplace.' },
  { question: "How do I buy and download a design?", answer: 'Open the design page and click "Buy/Download." After checkout, your file will appear in your Purchases/Downloads section, where you can download it anytime based on the license.' },
  { question: "How do licensing and usage rights work?", answer: "All designs come with a Standard Usage License, allowing you to use, modify, remix, and commercially use the asset in your own products, client work, marketing, and team projects—royalty-free. Reselling or redistributing the original CAD file itself is not permitted." },
  { question: "How do creators earn money and get paid?", answer: "Creators set their own prices when publishing. When a buyer purchases a design, creators earn the sale amount minus a 10% commission, with earnings visible in the dashboard." },
  { question: "Can I collaborate with other creators or share with my team?", answer: "Yes. Collaboration is supported through your dashboard. You can work with other creators on shared projects, and teams can manage access to designs based on the license or plan." },
  { question: "What if there's a problem with a file or I need help?", answer: "If a file is broken, incorrect, or you need support, contact us via the Contact Us page or email invite@marathon-os.com with the listing link or order details, and we'll help resolve it." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSchemaData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

import HomePage from "@/Components/Home/HomePage";
import Script from "next/script";
import styles from "./page.module.css";

export default function Home() {
  
  return (
    <>
      <Script
        id="json-ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className={styles["marathon"]}>
        <HomePage />
      </div>
    </>
  );
}
