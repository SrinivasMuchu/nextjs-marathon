/** @type {import('./schema').CadResourceArticle} */
export const cadDesignCostPricingGuideArticle = {
  slug: 'how-much-does-cad-design-cost-pricing-guide-for-3d-modeling-and-drafting',
  breadcrumbLastLabel: 'How much does CAD design cost?',
  metadata: {
    title: 'How Much Does CAD Design Cost? 3D Modeling & Drafting Pricing Guide | Marathon OS',
    description:
      'Learn what drives CAD design pricing: complexity, part count, drawings, rush timelines, and quote checklists. Compare hourly vs fixed-price models and brief for accurate estimates.',
  },
  hero: {
    badge: 'CAD Guides · Pricing',
    title: 'How Much Does CAD Design Cost? Pricing Guide for 3D Modeling and Drafting',
    lead:
      'Understand pricing ranges and cost drivers before you buy. Use this guide to compare quotes, spot scope gaps, and brief providers so estimates match what you need.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'CAD design pricing depends on scope, complexity, required drawings, file formats, revision rounds, and turnaround—not a single universal rate. Strong briefs and clear deliverables reduce rework and keep quotes predictable.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-cad-design-cost',
      title: 'What is “CAD design cost”?',
      paragraphs: [
        'CAD design cost is the price to produce a defined set of modeling and/or drafting outputs—parts, assemblies, 2D documentation, conversions, and exports—within agreed standards and timelines. Comparing quotes fairly means comparing the same scope, quality bar, and revision policy.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you think about CAD design cost?',
      cards: [
        {
          icon: '📦',
          title: 'Simple parts',
          body: 'Single-part models or basic drawings.',
        },
        {
          icon: '🧩',
          title: 'Assemblies',
          body: 'Multi-component products with interfaces.',
        },
        {
          icon: '📐',
          title: '2D drawings',
          body: 'Dimensioned sets for fabrication or patents.',
        },
        {
          icon: '🔄',
          title: 'Conversions',
          body: 'PDF-to-CAD or legacy redraws.',
        },
        {
          icon: '⏱️',
          title: 'Rush delivery',
          body: 'Faster timelines usually increase price.',
        },
        {
          icon: '🧠',
          title: 'Complexity drivers',
          body: 'Surfacing, tight tolerances, and large scope.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a CAD quote or provider',
      blocks: [
        {
          title: 'Deliverables listed',
          body: 'Confirm native CAD, STEP/IGES, DWG/DXF, PDF, and drawing packages—whatever your workflow requires.',
        },
        {
          title: 'Production readiness',
          body: 'Ask whether pricing assumes shop-ready documentation or visualization-only work.',
        },
        {
          title: 'Revision policy',
          body: 'Confirm included rounds and how scope changes affect price.',
        },
        {
          title: 'IP ownership + NDA',
          body: 'Make sure you own the work and confidentiality is covered.',
        },
        {
          title: 'Quality checks',
          body: 'For drawings: dimensions and tolerances. For models: clean geometry and correct interfaces.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'pricing-models',
      title: 'Hourly vs fixed-price vs in-house',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'Hourly freelancers',
          col2: 'Flexible',
          col3: 'Hard to predict',
          col4: 'Open-ended work',
        },
        {
          label: 'Fixed-price service',
          col2: 'Predictable',
          col3: 'Needs clear scope',
          col4: 'Most one-off deliverables',
        },
        {
          label: 'In-house',
          col2: 'Context',
          col3: 'High overhead',
          col4: 'Ongoing pipelines',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for an accurate quote',
      paragraphs: [
        'Include what it is, key dimensions, functional requirements, interfaces, target process (CNC, print, fabrication), and exact output formats. Attach sketches, references, or legacy files.',
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
          q: 'What affects CAD design cost most?',
          a: 'Complexity, number of parts, required drawings, and turnaround time.',
        },
        {
          q: 'Do you publish exact pricing?',
          a: 'Most services quote after reviewing scope; you can share requirements for an estimate.',
        },
        {
          q: 'Are simple drawings cheaper than 3D?',
          a: 'Often yes, but it depends on detail and standards.',
        },
        {
          q: 'How can I reduce cost?',
          a: 'Provide a clear brief, dimensions, and references; minimize ambiguity.',
        },
        {
          q: 'Is rush delivery available?',
          a: 'Often yes—rush typically increases cost.',
        },
        {
          q: 'Do I get a quote first?',
          a: 'Yes—submit a brief to get an estimate before committing.',
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
