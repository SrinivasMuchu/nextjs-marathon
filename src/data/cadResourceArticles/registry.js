import { hireCadDesignerOnlineArticle } from './hire-a-cad-designer-online-what-to-look-for-and-how-to-get-started'
import { onlineCadDesignServicesArticle } from './online-cad-design-services-how-they-work-and-when-to-use-one'
import { cadDesignOutsourcingGuideArticle } from './cad-design-outsourcing-a-complete-guide-for-product-teams'
import { freelanceVsPlatformArticle } from './freelance-cad-designer-vs-cad-service-platform-which-is-right-for-your-project'
import { hireSolidWorksDesignerArticle } from './hire-a-solidworks-designer-online-production-ready-files-in-24-hours'
import { fusion360DesignServiceArticle } from './fusion-360-design-service-get-a-custom-3d-model-from-a-vetted-designer'
import { autocadDraftingServicesArticle } from './autocad-drafting-services-online-2d-drawings-conversions-and-technical-docs'
import { revitModelingServicesArticle } from './revit-modeling-services-for-architects-and-engineers'
import { productModelingServiceArticle } from './3d-product-modeling-service-from-concept-to-production-ready-cad-file'
import { cad2dDrawingServiceArticle } from './2d-cad-drawing-service-technical-drawings-for-manufacturing-and-patents'
import { sheetMetalCadDesignServiceArticle } from './sheet-metal-cad-design-service-custom-parts-for-fabrication'
import { stlFileDesignServiceArticle } from './stl-file-design-service-3d-print-ready-models-on-demand'
import { productRenderingServiceArticle } from './product-rendering-service-photorealistic-3d-renders-from-your-cad-files'
import { mechanicalEngineeringCadServiceArticle } from './mechanical-engineering-cad-design-service-get-expert-cad-work-done-fast'
import { productDevelopmentCadInventorsStartupsArticle } from './product-development-cad-services-for-inventors-and-startups'
import { architecturalCadDraftingServicesArticle } from './architectural-cad-drafting-services-floor-plans-elevations-and-as-builts'
import { cadDesignCostPricingGuideArticle } from './how-much-does-cad-design-cost-pricing-guide-for-3d-modeling-and-drafting'
import { bestCadDesignServices2025Article } from './best-cad-design-services-online-in-2025-a-comparison-guide'
import { cadDesignBriefGuideArticle } from './how-to-write-a-cad-design-brief-templates-and-tips-for-getting-accurate-quotes'
import { pdfToCadConversionServiceArticle } from './pdf-to-cad-conversion-service-get-editable-dwg-step-files-from-any-drawing'

/** @type {Record<string, import('./schema').CadResourceArticle>} */
export const CAD_RESOURCE_ARTICLES_BY_SLUG = {
  [hireCadDesignerOnlineArticle.slug]: hireCadDesignerOnlineArticle,
  [onlineCadDesignServicesArticle.slug]: onlineCadDesignServicesArticle,
  [cadDesignOutsourcingGuideArticle.slug]: cadDesignOutsourcingGuideArticle,
  [freelanceVsPlatformArticle.slug]: freelanceVsPlatformArticle,
  [hireSolidWorksDesignerArticle.slug]: hireSolidWorksDesignerArticle,
  [fusion360DesignServiceArticle.slug]: fusion360DesignServiceArticle,
  [autocadDraftingServicesArticle.slug]: autocadDraftingServicesArticle,
  [revitModelingServicesArticle.slug]: revitModelingServicesArticle,
  [productModelingServiceArticle.slug]: productModelingServiceArticle,
  [cad2dDrawingServiceArticle.slug]: cad2dDrawingServiceArticle,
  [sheetMetalCadDesignServiceArticle.slug]: sheetMetalCadDesignServiceArticle,
  [stlFileDesignServiceArticle.slug]: stlFileDesignServiceArticle,
  [productRenderingServiceArticle.slug]: productRenderingServiceArticle,
  [mechanicalEngineeringCadServiceArticle.slug]: mechanicalEngineeringCadServiceArticle,
  [productDevelopmentCadInventorsStartupsArticle.slug]: productDevelopmentCadInventorsStartupsArticle,
  [architecturalCadDraftingServicesArticle.slug]: architecturalCadDraftingServicesArticle,
  [cadDesignCostPricingGuideArticle.slug]: cadDesignCostPricingGuideArticle,
  [bestCadDesignServices2025Article.slug]: bestCadDesignServices2025Article,
  [cadDesignBriefGuideArticle.slug]: cadDesignBriefGuideArticle,
  [pdfToCadConversionServiceArticle.slug]: pdfToCadConversionServiceArticle,
}

/**
 * @param {string} slug
 * @returns {import('./schema').CadResourceArticle | null}
 */
export function getCadResourceArticle(slug) {
  if (!slug) return null
  return CAD_RESOURCE_ARTICLES_BY_SLUG[slug] ?? null
}

export function getAllCadResourceSlugs() {
  return Object.keys(CAD_RESOURCE_ARTICLES_BY_SLUG)
}
