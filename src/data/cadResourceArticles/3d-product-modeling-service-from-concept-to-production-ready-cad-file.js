/** @type {import('./schema').CadResourceArticle} */
export const productModelingServiceArticle = {
  slug: '3d-product-modeling-service-from-concept-to-production-ready-cad-file',
  breadcrumbLastLabel: '3D product modeling service',
  metadata: {
    title: '3D Product Modeling Service — Production-Ready Deliverables | Marathon OS',
    description:
      'Get 3D product modeling from vetted CAD experts. Receive native CAD (as required), STEP/IGES exports, STL (if needed). Submit your brief and get high-quality deliverables fast—without managing freelancers.',
  },
  hero: {
    badge: 'CAD Services · Product modeling',
    title: '3D Product Modeling Service — Fast, Accurate, Production-Ready',
    lead:
      'Submit your brief. Get matched with a vetted expert. Receive native CAD (as required), STEP/IGES exports, STL (if needed) deliverables for manufacturing, prototyping, documentation, or review.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A 3D product modeling service provides specialized deliverables—native CAD (as required), STEP/IGES exports, STL (if needed)—created by vetted designers. The best providers clarify requirements upfront, deliver files that suppliers can use, include revisions, and protect your IP with clear ownership.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-modeling',
      title: 'What is 3D product modeling?',
      paragraphs: [
        '3D product modeling is a deliverable-focused service: you’re hiring for an output, not a tool. The goal is a file set that can be manufactured, printed, quoted, or reviewed—clean geometry, correct dimensions, and the formats your workflow requires.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you use 3D product modeling?',
      cards: [
        {
          icon: '💡',
          title: 'From idea to model',
          body: 'Turn sketches and requirements into a 3D CAD model.',
        },
        {
          icon: '🏭',
          title: 'Manufacturer quotes',
          body: 'Export STEP for supplier pricing and DFM feedback.',
        },
        {
          icon: '🧪',
          title: 'Prototype-ready',
          body: 'Get STL exports for quick printing and fit checks.',
        },
        {
          icon: '🔁',
          title: 'Iteration cycles',
          body: 'Update geometry based on testing and feedback.',
        },
        {
          icon: '📦',
          title: 'Packaging/assembly fit',
          body: 'Model interfaces and assembly relationships.',
        },
        {
          icon: '📐',
          title: 'Documentation add-on',
          body: 'Include drawings when needed for manufacturing.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a 3D product modeling provider',
      blocks: [
        {
          title: 'Output formats',
          body: 'Confirm exactly what files you’ll receive (native CAD (as required), STEP/IGES exports, STL (if needed)).',
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
          body: 'For drawings: dimensions/tolerances. For models: clean geometry and correct interfaces.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'diy-freelancer-managed',
      title: 'DIY vs freelancer vs managed service',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'DIY CAD',
          col2: 'No vendor cost',
          col3: 'Time + skill required',
          col4: 'Experienced CAD users',
        },
        {
          label: 'Freelancer',
          col2: 'Flexible',
          col3: 'Vetting risk',
          col4: 'Known trusted freelancers',
        },
        {
          label: 'Managed service',
          col2: 'Vetted + predictable',
          col3: 'Less ideal for open-ended R&D',
          col4: 'Fast production-ready outputs',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for this deliverable',
      paragraphs: [
        'Include what it is, key dimensions, functional requirements, interfaces, target process (CNC/print/fabrication), and exact output formats. Attach sketches, references, or legacy files.',
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
          q: 'What inputs do you need?',
          a: 'Sketches, dimensions, functional requirements, and reference photos/files.',
        },
        {
          q: 'What outputs will I receive?',
          a: 'Usually a native file (as required) plus STEP/IGES; STL if needed.',
        },
        {
          q: 'Is this suitable for manufacturing?',
          a: 'Yes—models are built for supplier quoting and production workflows.',
        },
        {
          q: 'Can you iterate?',
          a: 'Yes—revision rounds are included.',
        },
        {
          q: 'Do you do assemblies?',
          a: 'Yes—scope and timeline depend on complexity.',
        },
        {
          q: 'Do I own the model?',
          a: 'Yes—deliverables belong to you; NDA coverage included.',
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
