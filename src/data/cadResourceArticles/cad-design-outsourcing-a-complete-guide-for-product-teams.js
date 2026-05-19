/** @type {import('./schema').CadResourceArticle} */
export const cadDesignOutsourcingGuideArticle = {
  slug: 'cad-design-outsourcing-a-complete-guide-for-product-teams',
  breadcrumbLastLabel: 'CAD design outsourcing guide',
  metadata: {
    title: 'CAD Design Outsourcing — A Complete Guide for Product Teams | Marathon OS',
    description:
      'Learn when to outsource CAD design, how to choose a partner, and how to write briefs that produce production-ready files. Get matched with vetted CAD designers for fast delivery.',
  },
  hero: {
    badge: 'CAD Services · Guide',
    title: 'CAD Design Outsourcing for Product Teams — Faster Delivery, Less Risk',
    lead:
      'From concept to production-ready CAD: how outsourcing works, what it costs, and how to get great results without managing freelancers.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'Skip platform chaos. Get a vetted designer + clear deliverables.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'CAD design outsourcing means handing CAD modeling and drafting work to an external designer or service so your team can move faster. The best outsourcing setups deliver production-ready files (native CAD + STEP/DWG/STL exports), include revisions, and protect IP with clear ownership and NDAs.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-outsourcing',
      title: 'What is CAD design outsourcing?',
      paragraphs: [
        'Outsourcing CAD design means contracting external CAD specialists to create 3D models, 2D drawings, conversions, or revisions. For product teams, it’s a capacity lever—use it when internal engineers are overloaded, when you need a specialized tool, or when you need faster iteration without hiring.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-outsource',
      title: 'When should you outsource?',
      cards: [
        {
          icon: '🚀',
          title: 'You need to move fast',
          body: 'Prototype and sourcing timelines don’t wait for hiring cycles.',
        },
        {
          icon: '🧩',
          title: 'You lack a specific CAD tool',
          body: 'Outsource work in the exact software your workflow requires.',
        },
        {
          icon: '📐',
          title: 'You need drawings for suppliers',
          body: 'Get manufacturing-ready drawings and exports.',
        },
        {
          icon: '🔄',
          title: 'You need revisions',
          body: 'Update v1 → v2 or adapt to new constraints.',
        },
        {
          icon: '🧪',
          title: 'You need prototypes and test parts',
          body: 'Create print-ready or CNC-ready outputs quickly.',
        },
        {
          icon: '🔒',
          title: 'You need confidentiality + ownership',
          body: 'Use a service with defined IP terms and NDA coverage.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'choose-partner',
      title: 'How to choose an outsourcing partner',
      blocks: [
        {
          title: 'Deliverable quality',
          body: 'Ask for examples of production-ready outputs and documentation.',
        },
        {
          title: 'Process + communication',
          body: 'A good partner clarifies requirements, flags ambiguities, and documents assumptions.',
        },
        {
          title: 'Tool + domain match',
          body: 'Match the designer to your CAD tool and product type.',
        },
        {
          title: 'Timeline predictability',
          body: 'Prefer partners who commit to timelines and define revision rounds.',
        },
        {
          title: 'IP ownership + NDA',
          body: 'Your contract should assign IP to you and include confidentiality by default.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'inhouse-freelance-managed',
      title: 'In-house vs freelancers vs managed outsourcing',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'In-house',
          col2: 'Deep context, fast iterations',
          col3: 'Hiring cost/time',
          col4: 'Ongoing product lines',
        },
        {
          label: 'Freelancers',
          col2: 'Flexible, cheap at times',
          col3: 'Vetting + risk',
          col4: 'Long-term handpicked relationships',
        },
        {
          label: 'Managed CAD service',
          col2: 'Vetted, fast, predictable',
          col3: 'Less suited to open-ended R&D',
          col4: 'Production-ready files on a deadline',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-checklist',
      title: 'Outsourcing brief checklist (product teams)',
      paragraphs: [
        'Include: product goal, key dimensions, interfaces, materials/process assumptions, target manufacturing method, export formats, reference images, and success criteria. Treat the brief like a spec—clarity reduces revision cycles.',
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
      title: 'What types of projects can Marathon OS handle?',
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
          q: 'How do I keep IP safe when outsourcing?',
          a: 'Use NDA coverage and a contract that assigns deliverables to you.',
        },
        {
          q: 'What deliverables should I ask for?',
          a: 'Native CAD + exports like STEP/STL/DWG and drawings where needed.',
        },
        {
          q: 'Is outsourcing good for startups?',
          a: 'Yes—especially when speed matters and hiring is slow.',
        },
        {
          q: 'How do revisions work?',
          a: 'Agree on included revision rounds and what changes count as scope.',
        },
        {
          q: 'Can outsourcing handle complex assemblies?',
          a: 'Yes—timelines vary with complexity; clarify upfront.',
        },
        {
          q: 'How do I start?',
          a: 'Submit a brief with references and required formats for a fast quote and match.',
        },
      ],
    },
  ],
  bottomCta: {
    title: 'Ready to outsource CAD design?',
    sub: 'Submit your brief and get matched with a vetted CAD designer—production-ready deliverables, fast.',
    primaryCtaLabel: 'Start Your Project',
    learnMoreHref: '/cad-services',
    learnMoreLabel: 'Learn more about Marathon OS CAD Services →',
  },
}
