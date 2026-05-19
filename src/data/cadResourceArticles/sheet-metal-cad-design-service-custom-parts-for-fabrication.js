/** @type {import('./schema').CadResourceArticle} */
export const sheetMetalCadDesignServiceArticle = {
  slug: 'sheet-metal-cad-design-service-custom-parts-for-fabrication',
  breadcrumbLastLabel: 'Sheet metal CAD design service',
  metadata: {
    title: 'Sheet Metal CAD Design Service — Production-Ready Deliverables | Marathon OS',
    description:
      'Get sheet metal CAD design from vetted CAD experts. Receive STEP, DXF flat pattern, drawing (optional). Submit your brief and get high-quality deliverables fast—without managing freelancers.',
  },
  hero: {
    badge: 'CAD Services · Sheet metal',
    title: 'Sheet Metal CAD Design Service — Fast, Accurate, Production-Ready',
    lead:
      'Submit your brief. Get matched with a vetted expert. Receive STEP, DXF flat pattern, drawing (optional) deliverables for manufacturing, prototyping, documentation, or review.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A sheet metal CAD design service provides specialized deliverables—STEP, DXF flat pattern, drawing (optional)—created by vetted designers. The best providers clarify requirements upfront, deliver files that suppliers can use, include revisions, and protect your IP with clear ownership.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-sheet-metal',
      title: 'What is sheet metal CAD design?',
      paragraphs: [
        'Sheet metal CAD design is a deliverable-focused service: you’re hiring for fabrication-ready outputs, not a generic model. The goal is geometry and drawings a shop can cut, bend, and quote—correct thickness, bend relief, flat patterns, and the formats your workflow requires.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you use sheet metal CAD design?',
      cards: [
        {
          icon: '🧱',
          title: 'Fabrication-ready parts',
          body: 'Get bend-ready geometry and correct thickness.',
        },
        {
          icon: '📄',
          title: 'Flat patterns',
          body: 'Export DXF patterns for laser/waterjet cutting.',
        },
        {
          icon: '🔩',
          title: 'Enclosures & brackets',
          body: 'Design common sheet metal components quickly.',
        },
        {
          icon: '🔁',
          title: 'Revision for manufacturability',
          body: 'Adjust bends, reliefs, and fastener features.',
        },
        {
          icon: '🏭',
          title: 'Vendor quoting',
          body: 'Provide STEP/DXF files shops can quote immediately.',
        },
        {
          icon: '🧪',
          title: 'Prototype builds',
          body: 'Iterate fast before committing to production.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a sheet metal CAD design provider',
      blocks: [
        {
          title: 'Output formats',
          body: 'Confirm exactly what files you’ll receive (STEP, DXF flat pattern, drawing (optional)).',
        },
        {
          title: 'Production readiness',
          body: 'Ask whether deliverables are suitable for quoting/manufacturing—not just visuals.',
        },
        {
          title: 'Revision policy',
          body: 'Confirm included rounds and scope change rules.',
        },
        {
          title: 'IP ownership + NDA',
          body: 'Make sure you own the work and confidentiality is covered.',
        },
        {
          title: 'Quality checks',
          body: 'For drawings: dimensions/tolerances. For models: clean bend geometry, K-factor assumptions, and correct interfaces.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'diy-fab-managed',
      title: 'DIY vs local fab vs managed CAD service',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'DIY in CAD',
          col2: 'Full control',
          col3: 'Requires sheet metal know-how',
          col4: 'Experienced designers',
        },
        {
          label: 'Local fab shop',
          col2: 'Integrated build',
          col3: 'Limited design support',
          col4: 'Simple fabrication',
        },
        {
          label: 'Managed CAD service',
          col2: 'Vetted designers',
          col3: 'Needs clear requirements',
          col4: 'Fast, fabrication-ready files',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for this deliverable',
      paragraphs: [
        'Include what it is, material and thickness, bend radius / K-factor if known, critical dimensions, interfaces, hardware, and exact outputs (STEP, DXF flat, PDF drawings). Attach sketches, references, or legacy files.',
      ],
    },
    {
      type: 'steps',
      id: 'how-marathon',
      title: 'How Marathon OS CAD Services works',
      steps: [
        {
          title: 'Describe your project',
          body: 'Submit your brief, upload references, and specify required formats and deadline.',
        },
        {
          title: 'Get matched with a vetted designer',
          body: 'We assign a pre-qualified designer experienced in your tool and project type.',
        },
        {
          title: 'Receive production-ready files',
          body: 'You receive native CAD + export formats. Revisions are included.',
        },
      ],
      stepCtaLabel: 'Start Your Project',
    },
    {
      type: 'pillGrid',
      id: 'project-types',
      title: 'What projects can Marathon OS handle?',
      pills: [
        '3D Product Modeling',
        '2D Technical Drawings',
        'Sheet Metal Design',
        'Mechanical Assemblies',
        'Architectural Drafting',
        'STL Files for 3D Printing',
        'Patent Drawings',
        'CAD Conversions',
        'Reverse Engineering Models',
        'Enclosure Design',
        'Structural Components',
        'Consumer Product Design',
        'Industrial Equipment',
        'Electrical Enclosures',
        'Furniture & Millwork',
      ],
    },
    {
      type: 'faq',
      id: 'faq',
      title: 'Frequently Asked Questions',
      defaultOpen: true,
      items: [
        {
          q: 'Do you provide flat patterns?',
          a: 'Yes—DXF flat patterns can be included.',
        },
        {
          q: 'Can you design enclosures?',
          a: 'Yes—enclosures, brackets, panels, and mounts.',
        },
        {
          q: 'Do you account for thickness/bends?',
          a: 'Yes—provide material specs and bend requirements if you have them.',
        },
        {
          q: 'What do I need to provide?',
          a: 'Dimensions, mounting interfaces, and fabrication constraints.',
        },
        {
          q: 'Can you revise existing parts?',
          a: 'Yes—send existing files and desired changes.',
        },
        {
          q: 'Who owns the files?',
          a: 'You do—deliverables belong to you; NDA included.',
        },
      ],
    },
  ],
  bottomCta: {
    title: 'Ready to start?',
    sub: 'Submit your brief in minutes. Get production-ready deliverables with revisions included.',
    primaryCtaLabel: 'Start Your Project',
    learnMoreHref: '/cad-services',
    learnMoreLabel: 'Learn more about Marathon OS CAD Services →',
  },
}
