import React from "react";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadMatchView from "@/Components/CadMatch/CadMatchView";
import styles from "@/Components/CadMatch/CadMatch.module.css";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/cad-match";

export const metadata = buildPageMetadata({
  title: "CAD Match — Find Similar CAD Designs | Marathon OS",
  description:
    "Upload a CAD file and find the most similar designs in the Marathon library by shape. Free geometric similarity search for STEP, STL, and more.",
  canonicalPath: CANONICAL,
});

export default function CadMatchPage() {
  return (
    <div className={styles.root}>
      <CadMatchView />
      <Footer />
    </div>
  );
}
