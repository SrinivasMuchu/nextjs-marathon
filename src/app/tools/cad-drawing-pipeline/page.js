import { ASSET_PREFIX_URL } from "@/config";
import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
import CadDrawingPipelineOutputFormats from "@/Components/CadDrawingPipeline/CadDrawingPipelineOutputFormats";
import CadDrawingPipelineFinalCta from "@/Components/CadDrawingPipeline/CadDrawingPipelineFinalCta";
import CadDrawingPipelineFaq from "@/Components/CadDrawingPipeline/CadDrawingPipelineFaq";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadDrawingPipelinePaidCta from "@/Components/CadDrawingPipeline/CadDrawingPipelinePaidCta";
import CadDrawingPipelineTransparency from "@/Components/CadDrawingPipeline/CadDrawingPipelineTransparency";
import CadDrawingPipelineProcess from "@/Components/CadDrawingPipeline/CadDrawingPipelineProcess";
import CadDrawingPipelineSampleSheets from "@/Components/CadDrawingPipeline/CadDrawingPipelineSampleSheets";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

export const metadata = {
  title: "CAD drawing pipeline (STEP → TechDraw) | Marathon OS",
  description:
    "Upload a STEP file to generate technical drawings via the Marathon OS drawing pipeline.",
  openGraph: {
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: "image/png" }],
  },
  metadataBase: new URL(SITE),
  alternates: { canonical: CANONICAL },
};

function PipelineSectionFallback() {
  return <div className={styles.pipelineSectionFallback} aria-hidden />;
}

export default function CadDrawingPipelinePage() {
  return (
    <>
      <div className={styles.root}>
        <CadDrawingPipelineView />

        <div className={styles.page}>
          <Suspense fallback={<PipelineSectionFallback />}>
            <CadDrawingPipelineSampleSheets />
          </Suspense>
          <CadDrawingPipelineProcess />
          <CadDrawingPipelineOutputFormats />
          <CadDrawingPipelineTransparency />
          <CadDrawingPipelinePaidCta />
          <CadDrawingPipelineFaq />
        </div>

        <CadDrawingPipelineFinalCta />
      </div>
      <Footer />
    </>
  );
}
