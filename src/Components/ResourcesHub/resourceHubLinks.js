/**
 * Resources hub (`/resources`) — grouped by intent. Top nav uses flat `RESOURCE_HUB_LINKS`.
 * Each section: `{ id, heading, links: [...], emptyHint?: string }` (use `emptyHint` when links are not live yet).
 *
 * Planned additions (add `links` entries when articles ship):
 * - Deliverable-type: 3D/2D, sheet metal, STL
 * - Industry vertical: mechanical, inventors/startups, architectural, product rendering
 * - Comparison/decision: pricing guide, best services (2025), CAD brief, PDF-to-CAD (live)
 */

export const RESOURCE_HUB_SECTIONS = [
  {
    id: 'direct-service-intent',
    heading: 'Direct service intent pages',
    links: [
      {
        href: '/cad-services/hire-a-cad-designer-online-what-to-look-for-and-how-to-get-started',
        title: 'Hire a CAD Designer Online',
        description:
          'What to look for, how to write a brief, Upwork vs. dedicated CAD services, and how Marathon OS delivers in 24 hours.',
        navLabel: 'Hire a CAD designer online',
      },
      {
        href: '/cad-services/online-cad-design-services-how-they-work-and-when-to-use-one',
        title: 'Online CAD Design Services',
        description:
          'How managed CAD services work, when to use one, marketplace vs. Marathon OS, and how to brief for the best results.',
        navLabel: 'Online CAD design services',
      },
      {
        href: '/cad-services/cad-design-outsourcing-a-complete-guide-for-product-teams',
        title: 'CAD Design Outsourcing Guide',
        description:
          'When to outsource, how to pick a partner, in-house vs. freelancers vs. managed services, and a product-team brief checklist.',
        navLabel: 'CAD design outsourcing guide',
      },
      {
        href: '/cad-services/freelance-cad-designer-vs-cad-service-platform-which-is-right-for-your-project',
        title: 'Freelance CAD Designer vs. Platform',
        description:
          'Compare freelancers and managed CAD platforms on vetting, speed, revisions, and IP—and when each option wins.',
        navLabel: 'Freelancer vs. CAD platform',
      },
    ],
  },
  {
    id: 'software-specific-service-pages',
    heading: 'Software-specific service pages',
    links: [
      {
        href: '/cad-services/hire-a-solidworks-designer-online-production-ready-files-in-24-hours',
        title: 'Hire a SolidWorks Designer',
        description:
          'Native SLDPRT, SLDASM, SLDDRW plus STEP, IGES, DWG, DXF, STL—what to ask for, when to hire, and how Marathon OS matches you.',
        navLabel: 'Hire a SolidWorks designer',
      },
      {
        href: '/cad-services/fusion-360-design-service-get-a-custom-3d-model-from-a-vetted-designer',
        title: 'Fusion 360 Design Service',
        description:
          'Native F3D, F3Z plus STEP, IGES, STL, DWG, DXF—briefing tips, freelancer vs. managed service, and how Marathon OS delivers.',
        navLabel: 'Fusion 360 design service',
      },
      {
        href: '/cad-services/autocad-drafting-services-online-2d-drawings-conversions-and-technical-docs',
        title: 'AutoCAD Drafting Services',
        description:
          'DWG, DXF, PDF conversions, as-builts, and technical docs—what to require, how to brief, and Marathon OS drafting workflow.',
        navLabel: 'AutoCAD drafting services',
      },
      {
        href: '/cad-services/revit-modeling-services-for-architects-and-engineers',
        title: 'Revit Modeling Services',
        description:
          'BIM modeling, sheets, IFC/DWG/PDF exports, coordination—as-built and documentation scope with vetted Revit experts.',
        navLabel: 'Revit modeling services',
      },
    ],
  },
  {
    id: 'deliverable-type-pages',
    heading: 'Deliverable-type pages',
    links: [
      {
        href: '/cad-services/3d-product-modeling-service-from-concept-to-production-ready-cad-file',
        title: '3D Product Modeling Service',
        description:
          'From concept to production-ready CAD: formats, when to use modeling, DIY vs. managed service, and how to brief for quotes and prototypes.',
        navLabel: '3D product modeling service',
      },
      {
        href: '/cad-services/2d-cad-drawing-service-technical-drawings-for-manufacturing-and-patents',
        title: '2D CAD Drawing Service',
        description:
          'DWG/DXF, PDF, patent and shop drawings—in-house vs. freelancer vs. managed, what to require, and how to brief.',
        navLabel: '2D CAD drawing service',
      },
      {
        href: '/cad-services/sheet-metal-cad-design-service-custom-parts-for-fabrication',
        title: 'Sheet Metal CAD Design Service',
        description:
          'STEP, DXF flat patterns, enclosures and brackets—DIY vs fab vs managed, DFM-focused briefs, and Marathon OS workflow.',
        navLabel: 'Sheet metal CAD design',
      },
      {
        href: '/cad-services/stl-file-design-service-3d-print-ready-models-on-demand',
        title: 'STL File Design Service',
        description:
          'Print-ready meshes, STEP/native options, snap-fits and iterations—briefing for FDM/SLA/SLS and Marathon OS delivery.',
        navLabel: 'STL file design service',
      },
    ],
  },
  {
    id: 'industry-vertical-pages',
    heading: 'Industry vertical pages',
    links: [
      {
        href: '/cad-services/mechanical-engineering-cad-design-service-get-expert-cad-work-done-fast',
        title: 'Mechanical Engineering CAD Service',
        description:
          'Parts, assemblies, drawings, fixtures—full-time vs freelancer vs managed, outputs for manufacturing, and how to brief.',
        navLabel: 'Mechanical engineering CAD',
      },
      {
        href: '/cad-services/product-development-cad-services-for-inventors-and-startups',
        title: 'Product Development CAD for Inventors & Startups',
        description:
          'STEP for quotes, STL for prototypes, optional drawings—managed deliverables for founders without hiring freelancers.',
        navLabel: 'Product development CAD (inventors)',
      },
      {
        href: '/cad-services/architectural-cad-drafting-services-floor-plans-elevations-and-as-builts',
        title: 'Architectural CAD Drafting Services',
        description:
          'Floor plans, elevations, as-builts, DWG/DXF and PDF sets—in-house vs freelancer vs managed, standards, and how to brief.',
        navLabel: 'Architectural CAD drafting',
      },
      {
        href: '/cad-services/product-rendering-service-photorealistic-3d-renders-from-your-cad-files',
        title: 'Product Rendering Service',
        description:
          'Photorealistic PNG/JPG, turntables, exploded views—DIY vs freelancer vs managed, briefs for look-dev, and Marathon OS workflow.',
        navLabel: 'Product rendering service',
      },
    ],
  },
  {
    id: 'comparison-decision-pages',
    heading: 'Comparison and decision pages',
    links: [
      {
        href: '/cad-services/how-much-does-cad-design-cost-pricing-guide-for-3d-modeling-and-drafting',
        title: 'How Much Does CAD Design Cost?',
        description:
          'Pricing drivers for 3D modeling and drafting, quote checklist, and hourly vs fixed-price vs in-house.',
        navLabel: 'CAD design cost guide',
      },
      {
        href: '/cad-services/best-cad-design-services-online-in-2025-a-comparison-guide',
        title: 'Best CAD Design Services Online (2025)',
        description:
          'Compare marketplaces, design networks, and managed CAD on vetting, speed, deliverables, revisions, and IP.',
        navLabel: 'Best CAD services comparison',
      },
      {
        href: '/cad-services/how-to-write-a-cad-design-brief-templates-and-tips-for-getting-accurate-quotes',
        title: 'How to Write a CAD Design Brief',
        description:
          'Templates and tips: scope, dimensions, manufacturing context, and structured briefs for accurate quotes.',
        navLabel: 'CAD design brief guide',
      },
      {
        href: '/cad-services/pdf-to-cad-conversion-service-get-editable-dwg-step-files-from-any-drawing',
        title: 'PDF to CAD Conversion Service',
        description:
          'Editable DWG/DXF, optional STEP, clean PDFs—scans, layers, revisions, and when 3D reconstruction applies.',
        navLabel: 'PDF to CAD conversion',
      },
    ],
  },
]

export const RESOURCE_HUB_LINKS = RESOURCE_HUB_SECTIONS.flatMap((section) => section.links)
