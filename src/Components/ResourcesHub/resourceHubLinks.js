/**
 * Grouped cards on `/resources`. Nav uses `RESOURCE_HUB_LINKS` (flat list).
 * Each item: `{ href, title, description, navLabel? }`
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
  // Software-specific CAD guides (e.g. SolidWorks, Fusion, AutoCAD) — add new slugs here.
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
]

export const RESOURCE_HUB_LINKS = RESOURCE_HUB_SECTIONS.flatMap((section) => section.links)
