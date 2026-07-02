const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://marathon-os.com';

export default function sitemap() {
  return [
    { url: `${SITE_ORIGIN}/tools/3d-cad-viewer` },
    { url: `${SITE_ORIGIN}/tools/3d-cad-file-converter` },
    { url: `${SITE_ORIGIN}/tools` },
    { url: `${SITE_ORIGIN}/resources` },
    { url: `${SITE_ORIGIN}/resources/hire-a-cad-designer-online-what-to-look-for-and-how-to-get-started` },
    { url: `${SITE_ORIGIN}/resources/online-cad-design-services-how-they-work-and-when-to-use-one` },
    { url: `${SITE_ORIGIN}/resources/cad-design-outsourcing-a-complete-guide-for-product-teams` },
    {
      url: `${SITE_ORIGIN}/resources/freelance-cad-designer-vs-cad-service-platform-which-is-right-for-your-project`,
    },
    { url: `${SITE_ORIGIN}/resources/hire-a-solidworks-designer-online-production-ready-files-in-24-hours` },
    { url: `${SITE_ORIGIN}/resources/fusion-360-design-service-get-a-custom-3d-model-from-a-vetted-designer` },
    { url: `${SITE_ORIGIN}/resources/autocad-drafting-services-online-2d-drawings-conversions-and-technical-docs` },
    { url: `${SITE_ORIGIN}/resources/revit-modeling-services-for-architects-and-engineers` },
    { url: `${SITE_ORIGIN}/resources/3d-product-modeling-service-from-concept-to-production-ready-cad-file` },
    {
      url: `${SITE_ORIGIN}/resources/2d-cad-drawing-service-technical-drawings-for-manufacturing-and-patents`,
    },
    { url: `${SITE_ORIGIN}/resources/sheet-metal-cad-design-service-custom-parts-for-fabrication` },
    { url: `${SITE_ORIGIN}/resources/stl-file-design-service-3d-print-ready-models-on-demand` },
    { url: `${SITE_ORIGIN}/resources/mechanical-engineering-cad-design-service-get-expert-cad-work-done-fast` },
    { url: `${SITE_ORIGIN}/resources/product-development-cad-services-for-inventors-and-startups` },
    {
      url: `${SITE_ORIGIN}/resources/architectural-cad-drafting-services-floor-plans-elevations-and-as-builts`,
    },
    {
      url: `${SITE_ORIGIN}/resources/product-rendering-service-photorealistic-3d-renders-from-your-cad-files`,
    },
    {
      url: `${SITE_ORIGIN}/resources/how-much-does-cad-design-cost-pricing-guide-for-3d-modeling-and-drafting`,
    },
    { url: `${SITE_ORIGIN}/resources/best-cad-design-services-online-in-2025-a-comparison-guide` },
    {
      url: `${SITE_ORIGIN}/resources/how-to-write-a-cad-design-brief-templates-and-tips-for-getting-accurate-quotes`,
    },
    {
      url: `${SITE_ORIGIN}/resources/pdf-to-cad-conversion-service-get-editable-dwg-step-files-from-any-drawing`,
    },
  ];
}
