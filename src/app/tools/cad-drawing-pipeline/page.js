import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
import CadDrawingPipelineOutputFormats from "@/Components/CadDrawingPipeline/CadDrawingPipelineOutputFormats";
import CadDrawingPipelineFinalCta from "@/Components/CadDrawingPipeline/CadDrawingPipelineFinalCta";
import CadDrawingPipelineFaq from "@/Components/CadDrawingPipeline/CadDrawingPipelineFaq";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadDrawingPipelinePaidCta from "@/Components/CadDrawingPipeline/CadDrawingPipelinePaidCta";
import CadDrawingPipelineTransparency from "@/Components/CadDrawingPipeline/CadDrawingPipelineTransparency";
import CadDrawingPipelineHowItWorks from "@/Components/CadDrawingPipeline/CadDrawingPipelineHowItWorks";
import CadDrawingPipelineProcess from "@/Components/CadDrawingPipeline/CadDrawingPipelineProcess";
import CadDrawingPipelineSampleSheets from "@/Components/CadDrawingPipeline/CadDrawingPipelineSampleSheets";
import CadDrawingPipelineHeroSection from "@/Components/CadDrawingPipeline/CadDrawingPipelineHeroSection";
import SoftwareApplicationJsonLd from "@/Components/JsonLdSchemas/SoftwareApplicationJsonLd";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";
import TechDrawPageViewTracker from "@/Components/CadDrawingPipeline/TechDrawPageViewTracker";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";
const TITLE = "CAD Drawing Pipeline (STEP to TechDraw) | Marathon OS";
const DESCRIPTION =
  "Upload a STEP file to generate AI-assisted technical drawing sheets in PDF, SVG, DXF, and PNG formats via the Marathon OS drawing pipeline.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: CANONICAL,
});

function PipelineSectionFallback() {
  return <div className={styles.pipelineSectionFallback} aria-hidden />;
}

export default function CadDrawingPipelinePage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="CAD Drawing Pipeline (STEP to TechDraw)"
        url={`${SITE}${CANONICAL}`}
        description="Upload a STEP file to generate AI-assisted technical drawing sheets in PDF, SVG, DXF, and PNG formats."
        price="4.99"
        priceCurrency="USD"
      />
      <TechDrawPageViewTracker pageType="upload" />
      <div className={styles.root}>
        <CadDrawingPipelineHeroSection>
          <Suspense fallback={<PipelineSectionFallback />}>
            <CadDrawingPipelineView />
          </Suspense>
        </CadDrawingPipelineHeroSection>

        <div className={styles.page}>
          <CadDrawingPipelineHowItWorks />
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
