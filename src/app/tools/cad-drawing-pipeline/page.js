import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
import CadDrawingPipelineOutputFormats from "@/Components/CadDrawingPipeline/CadDrawingPipelineOutputFormats";
import CadDrawingPipelineFinalCta from "@/Components/CadDrawingPipeline/CadDrawingPipelineFinalCta";
import CadDrawingPipelineFaq from "@/Components/CadDrawingPipeline/CadDrawingPipelineFaq";
import Footer from "@/Components/HomePages/Footer/Footer";
import CadDrawingPipelinePaidCta from "@/Components/CadDrawingPipeline/CadDrawingPipelinePaidCta";
import CadDrawingPipelineTransparency from "@/Components/CadDrawingPipeline/CadDrawingPipelineTransparency";
import CadDrawingPipelineProcess from "@/Components/CadDrawingPipeline/CadDrawingPipelineProcess";
import CadDrawingPipelineSampleSheets from "@/Components/CadDrawingPipeline/CadDrawingPipelineSampleSheets";
import CadDrawingPipelineHeroServer from "@/Components/CadDrawingPipeline/CadDrawingPipelineHeroServer";
import CadDrawingPipelineInfoSections from "@/Components/CadDrawingPipeline/CadDrawingPipelineInfoSections";
import SoftwareApplicationJsonLd from "@/Components/JsonLdSchemas/SoftwareApplicationJsonLd";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";
import TechDrawPageViewTracker from "@/Components/CadDrawingPipeline/TechDrawPageViewTracker";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import {
  CAD_DRAWING_PIPELINE_DESCRIPTION,
  CAD_DRAWING_PIPELINE_TITLE,
} from "@/data/cadDrawingPipelinePage";
import { TECHDRAW_BASE_PRICE_USD } from "@/api/cadDrawingPipelineApi";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

export const metadata = buildPageMetadata({
  title: CAD_DRAWING_PIPELINE_TITLE,
  description: CAD_DRAWING_PIPELINE_DESCRIPTION,
  canonicalPath: CANONICAL,
  pageUrl: `${SITE}${CANONICAL}`,
  extra: {
    alternates: { canonical: `${SITE}${CANONICAL}` },
  },
});

function PipelineSectionFallback() {
  return <div className={styles.pipelineSectionFallback} aria-hidden />;
}

export default function CadDrawingPipelinePage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="3D CAD to 2D Technical Drawing Generator"
        url={`${SITE}${CANONICAL}`}
        description={CAD_DRAWING_PIPELINE_DESCRIPTION}
        price={String(TECHDRAW_BASE_PRICE_USD)}
        priceCurrency="USD"
      />
      <TechDrawPageViewTracker pageType="upload" />
      <div className={styles.root}>
        <CadDrawingPipelineHeroServer />
        <Suspense fallback={<PipelineSectionFallback />}>
          <CadDrawingPipelineView />
        </Suspense>

        <div className={styles.page}>
          <CadDrawingPipelineInfoSections />
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
