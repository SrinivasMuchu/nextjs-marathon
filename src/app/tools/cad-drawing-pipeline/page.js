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
import CadDrawingPipelineInfoSections from "@/Components/CadDrawingPipeline/CadDrawingPipelineInfoSections";
import CadDrawingPipelineInternalLinks from "@/Components/CadDrawingPipeline/CadDrawingPipelineInternalLinks";
import ToolPageJsonLd from "@/Components/JsonLdSchemas/ToolPageJsonLd";
import CadDrawingPipelineHeroSection from "@/Components/CadDrawingPipeline/CadDrawingPipelineHeroSection";
import SoftwareApplicationJsonLd from "@/Components/JsonLdSchemas/SoftwareApplicationJsonLd";
import { TECHDRAW_CHECKOUT_TOTAL_USD } from "@/api/cadDrawingPipelineApi";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";
import TechDrawPageViewTracker from "@/Components/CadDrawingPipeline/TechDrawPageViewTracker";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import {
  PIPELINE_PAGE_DESCRIPTION,
  PIPELINE_PAGE_TITLE,
} from "@/data/cadDrawingPipelinePage";
import { fetchTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

/** Always re-read admin techdraw_upload_price — do not bake price into static HTML. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: PIPELINE_PAGE_TITLE,
  description: PIPELINE_PAGE_DESCRIPTION,
  canonicalPath: CANONICAL,
});

function PipelineSectionFallback() {
  return <div className={styles.pipelineSectionFallback} aria-hidden />;
}

export default async function CadDrawingPipelinePage() {
  const prices = await fetchTechDrawPriceDisplay();
  const priceAmount = Number(prices.total).toFixed(2);

  return (
    <>
      <ToolPageJsonLd
        name="3D CAD to 2D Technical Drawing Generator"
        url={`${SITE}${CANONICAL}`}
        description={PIPELINE_PAGE_DESCRIPTION}
        price={String(TECHDRAW_CHECKOUT_TOTAL_USD)}
        priceCurrency="USD"
        breadcrumbLinks={[
          { label: "Tools", href: "/tools" },
          { label: "3D CAD to 2D Drawing Generator" },
        ]}
      />
      <TechDrawPageViewTracker pageType="upload" />
      <div className={styles.root}>
        <CadDrawingPipelineHeroSection
          priceLabel={prices.totalLabel}
          initialPrices={prices}
        >
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
          <CadDrawingPipelineInfoSections />
          <CadDrawingPipelineOutputFormats />
          <CadDrawingPipelineTransparency />
          <CadDrawingPipelinePaidCta initialPrices={prices} />
          <CadDrawingPipelineFaq priceLabel={prices.totalLabel} />
          <CadDrawingPipelineInternalLinks />
        </div>

        <CadDrawingPipelineFinalCta initialPrices={prices} />
      </div>
      <Footer />
    </>
  );
}
