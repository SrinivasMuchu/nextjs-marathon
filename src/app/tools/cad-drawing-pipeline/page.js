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
import CadDrawingPipelineInternalLinks from "@/Components/CadDrawingPipeline/CadDrawingPipelineInternalLinks";
import ToolPageJsonLd from "@/Components/JsonLdSchemas/ToolPageJsonLd";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";
import TechDrawPageViewTracker from "@/Components/CadDrawingPipeline/TechDrawPageViewTracker";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import {
  PIPELINE_PAGE_DESCRIPTION,
  PIPELINE_PAGE_TITLE,
} from "@/data/cadDrawingPipelinePage";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

export const metadata = buildPageMetadata({
  title: PIPELINE_PAGE_TITLE,
  description: PIPELINE_PAGE_DESCRIPTION,
  canonicalPath: CANONICAL,
});

function PipelineSectionFallback() {
  return <div className={styles.pipelineSectionFallback} aria-hidden />;
}

export default function CadDrawingPipelinePage() {
  return (
    <>
      <ToolPageJsonLd
        name="3D CAD to 2D Technical Drawing Generator"
        url={`${SITE}${CANONICAL}`}
        description={PIPELINE_PAGE_DESCRIPTION}
        price="4.99"
        priceCurrency="USD"
        breadcrumbLinks={[
          { label: "Tools", href: "/tools" },
          { label: "3D CAD to 2D Drawing Generator" },
        ]}
      />
      <TechDrawPageViewTracker pageType="upload" />
      <div className={styles.root}>
        <CadDrawingPipelineHeroServer />
        <Suspense fallback={<PipelineSectionFallback />}>
          <CadDrawingPipelineView />
        </Suspense>

        <div className={styles.page}>
          <Suspense fallback={<PipelineSectionFallback />}>
            <CadDrawingPipelineSampleSheets />
          </Suspense>
          <CadDrawingPipelineProcess />
          <CadDrawingPipelineInfoSections />
          <CadDrawingPipelineOutputFormats />
          <CadDrawingPipelineTransparency />
          <CadDrawingPipelinePaidCta />
          <CadDrawingPipelineFaq />
          <CadDrawingPipelineInternalLinks />
        </div>

        <CadDrawingPipelineFinalCta />
      </div>
      <Footer />
    </>
  );
}
