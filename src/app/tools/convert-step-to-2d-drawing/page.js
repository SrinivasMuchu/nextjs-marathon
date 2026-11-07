import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
// Remaining old sections, not yet rebuilt:
// import CadDrawingPipelineOutputFormats from "@/Components/CadDrawingPipeline/CadDrawingPipelineOutputFormats";
// import CadDrawingPipelineFinalCta from "@/Components/CadDrawingPipeline/CadDrawingPipelineFinalCta";
// import CadDrawingPipelineFaq from "@/Components/CadDrawingPipeline/CadDrawingPipelineFaq";
import Footer from "@/Components/HomePages/Footer/Footer";
// import CadDrawingPipelinePaidCta from "@/Components/CadDrawingPipeline/CadDrawingPipelinePaidCta";
// import CadDrawingPipelineTransparency from "@/Components/CadDrawingPipeline/CadDrawingPipelineTransparency";
// import CadDrawingPipelineHowItWorks from "@/Components/CadDrawingPipeline/CadDrawingPipelineHowItWorks";
// import CadDrawingPipelineProcess from "@/Components/CadDrawingPipeline/CadDrawingPipelineProcess";
// import CadDrawingPipelineSampleSheets from "@/Components/CadDrawingPipeline/CadDrawingPipelineSampleSheets";
// import CadDrawingPipelineInfoSections from "@/Components/CadDrawingPipeline/CadDrawingPipelineInfoSections";
// import CadDrawingPipelineInternalLinks from "@/Components/CadDrawingPipeline/CadDrawingPipelineInternalLinks";
import ToolPageJsonLd from "@/Components/JsonLdSchemas/ToolPageJsonLd";
import CadDrawingPipelineHeroSection from "@/Components/CadDrawingPipeline/CadDrawingPipelineHeroSection";
import CadDrawingPipelinePricing from "@/Components/CadDrawingPipeline/CadDrawingPipelinePricing";
import CadDrawingPipelineReasons from "@/Components/CadDrawingPipeline/CadDrawingPipelineReasons";
import CadDrawingPipelineWorkflow from "@/Components/CadDrawingPipeline/CadDrawingPipelineWorkflow";
import CadDrawingPipelineSimpleSteps from "@/Components/CadDrawingPipeline/CadDrawingPipelineSimpleSteps";
import CadDrawingPipelineDrawingSet from "@/Components/CadDrawingPipeline/CadDrawingPipelineDrawingSet";
import CadDrawingPipelineFormats from "@/Components/CadDrawingPipeline/CadDrawingPipelineFormats";
import CadDrawingPipelineCompare from "@/Components/CadDrawingPipeline/CadDrawingPipelineCompare";
import CadDrawingPipelineUses from "@/Components/CadDrawingPipeline/CadDrawingPipelineUses";
import CadDrawingPipelineEditGuide from "@/Components/CadDrawingPipeline/CadDrawingPipelineEditGuide";
import CadDrawingPipelineUnderTheHood from "@/Components/CadDrawingPipeline/CadDrawingPipelineUnderTheHood";
import CadDrawingPipelineTroubleshooting from "@/Components/CadDrawingPipeline/CadDrawingPipelineTroubleshooting";
import CadDrawingPipelineOwnership from "@/Components/CadDrawingPipeline/CadDrawingPipelineOwnership";
import CadDrawingPipelineQuestions from "@/Components/CadDrawingPipeline/CadDrawingPipelineQuestions";
import CadDrawingPipelineMoreTools from "@/Components/CadDrawingPipeline/CadDrawingPipelineMoreTools";
import SoftwareApplicationJsonLd from "@/Components/JsonLdSchemas/SoftwareApplicationJsonLd";
import styles from "@/Components/CadDrawingPipeline/CadDrawingPipeline.module.css";
import React, { Suspense } from "react";
import TechDrawPageViewTracker from "@/Components/CadDrawingPipeline/TechDrawPageViewTracker";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";
import {
  PIPELINE_PAGE_DESCRIPTION,
  PIPELINE_PAGE_TITLE,
} from "@/data/cadDrawingPipelinePage";
import { fetchTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import {
  fetchConverterPricingInfo,
  getFreeConversionsPerUser,
  getSinglePriceLabelFromInfo,
  isSizeLimitPlan,
} from "@/lib/converterPricing";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/convert-step-to-2d-drawing";

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
  let converterOffer = null;
  try {
    const info = await fetchConverterPricingInfo();
    converterOffer = {
      priceLabel: getSinglePriceLabelFromInfo(info) || "",
      freeCount: getFreeConversionsPerUser(info),
      allFree: Boolean(info?.conversion_free),
      sizeLimit: isSizeLimitPlan(info),
    };
  } catch (err) {
    console.warn("[converter] pricing-info failed:", err?.message || err);
  }

  return (
    <>
      <ToolPageJsonLd
        name={PIPELINE_PAGE_TITLE}
        url={`${SITE}${CANONICAL}`}
        description={PIPELINE_PAGE_DESCRIPTION}
        price={priceAmount}
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
            <CadDrawingPipelineView initialPrices={prices} />
          </Suspense>
        </CadDrawingPipelineHeroSection>

        <CadDrawingPipelinePricing
          initialPrices={prices}
          initialConverterOffer={converterOffer}
        />
        <CadDrawingPipelineReasons />
        <CadDrawingPipelineWorkflow />
        <CadDrawingPipelineSimpleSteps initialPrices={prices} />
        <CadDrawingPipelineDrawingSet />
        <CadDrawingPipelineFormats />
        <CadDrawingPipelineCompare initialPrices={prices} />
        <CadDrawingPipelineUses />
        <CadDrawingPipelineEditGuide />
        <CadDrawingPipelineUnderTheHood />
        <CadDrawingPipelineTroubleshooting />
        <CadDrawingPipelineOwnership />
        <CadDrawingPipelineQuestions initialPrices={prices} />
        <CadDrawingPipelineMoreTools />

        {/* Remaining old sections, not yet rebuilt:
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
        */}
      </div>
      <Footer />
    </>
  );
}
