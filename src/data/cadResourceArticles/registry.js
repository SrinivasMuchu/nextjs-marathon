import { hireCadDesignerOnlineArticle } from './hire-a-cad-designer-online-what-to-look-for-and-how-to-get-started'
import { onlineCadDesignServicesArticle } from './online-cad-design-services-how-they-work-and-when-to-use-one'
import { cadDesignOutsourcingGuideArticle } from './cad-design-outsourcing-a-complete-guide-for-product-teams'
import { freelanceVsPlatformArticle } from './freelance-cad-designer-vs-cad-service-platform-which-is-right-for-your-project'
import { hireSolidWorksDesignerArticle } from './hire-a-solidworks-designer-online-production-ready-files-in-24-hours'
import { fusion360DesignServiceArticle } from './fusion-360-design-service-get-a-custom-3d-model-from-a-vetted-designer'
import { autocadDraftingServicesArticle } from './autocad-drafting-services-online-2d-drawings-conversions-and-technical-docs'
import { revitModelingServicesArticle } from './revit-modeling-services-for-architects-and-engineers'

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
