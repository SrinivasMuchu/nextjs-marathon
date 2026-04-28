/** @type {import('./schema').CadResourceArticle} */
export const stlFileDesignServiceArticle = {
  slug: 'stl-file-design-service-3d-print-ready-models-on-demand',
  breadcrumbLastLabel: 'STL file design service',
  metadata: {
    title: 'STL File Design Service — Production-Ready Deliverables | Marathon OS',
    description:
      'Get STL file design from vetted CAD experts. Receive STL, STEP (optional), native CAD (optional). Submit your brief and get high-quality deliverables fast—without managing freelancers.',
  },
  hero: {
    badge: 'CAD Services · 3D printing',
    title: 'STL File Design Service — Fast, Accurate, Production-Ready',
    lead:
      'Submit your brief. Get matched with a vetted expert. Receive STL, STEP (optional), native CAD (optional) deliverables for manufacturing, prototyping, documentation, or review.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'An STL file design service provides specialized deliverables—STL, STEP (optional), native CAD (optional)—created by vetted designers. The best providers clarify requirements upfront, deliver meshes that printers can slice reliably, include revisions, and protect your IP with clear ownership.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-stl-design',
      title: 'What is STL file design?',
      paragraphs: [
        'STL file design is a deliverable-focused service: you’re hiring for print-ready mesh output, not a generic render. The goal is watertight, properly scaled geometry that your slicer and printer can handle—correct units, adequate wall thickness, and optional STEP/native CAD when you need editable source.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you use STL file design?',
      cards: [
        {
          icon: '🖨️',
          title: 'Print-ready models',
          body: 'Get geometry designed for successful printing.',
        },
        {
          icon: '🔁',
          title: 'Iteration cycles',
          body: 'Adjust for fit, strength, and printability.',
        },
        {
          icon: '🧩',
          title: 'Assemblies & snap-fits',
          body: 'Design functional parts with proper clearances.',
        },
        {
          icon: '📏',
          title: 'Dimensional accuracy',
          body: 'Ensure critical dimensions are modeled correctly.',
        },
        {
          icon: '🧪',
          title: 'Prototype workflow',
          body: 'Move from idea → printed prototype quickly.',
        },
        {
          icon: '🔄',
          title: 'Convert to printable',
          body: 'Turn STEP/other geometry into clean STL output.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in an STL file design provider',
      blocks: [
        {
          title: 'Output formats',
          body: 'Confirm exactly what files you’ll receive (STL, STEP (optional), native CAD (optional)).',
        },
        {
          title: 'Production readiness',
          body: 'Ask whether meshes are printable for your process—not just visually “close enough”.',
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
          body: 'For STL: watertight mesh, sane normals, minimum feature size, and correct scale. For optional CAD: clean solid modeling and interfaces.',
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
          label: 'DIY CAD → STL',
          col2: 'Free',
          col3: 'Skill/time',
          col4: 'CAD-savvy makers',
        },
        {
          label: 'Freelancer',
          col2: 'Flexible',
          col3: 'Quality variance',
          col4: 'One-off prints',
        },
        {
          label: 'Managed service',
          col2: 'Reliable output',
          col3: 'Needs brief',
          col4: 'Print-ready STL fast',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for this deliverable',
      paragraphs: [
        'Include what it is, key dimensions, functional requirements, printer/material (FDM, SLA, SLS, etc.), layer height or min feature size if known, and exact outputs (STL only vs STL + STEP/native). Attach sketches, references, or legacy files.',
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
          q: 'Will the STL be print-ready?',
          a: 'Yes—modeled to be printable based on your printer/process constraints.',
        },
        {
          q: 'Do you also provide STEP?',
          a: 'If requested, STEP exports can be included.',
        },
        {
          q: 'Can you design snap-fits?',
          a: 'Yes—provide material and printer constraints.',
        },
        {
          q: 'Do you work from sketches?',
          a: 'Yes—sketch/photo + dimensions is enough.',
        },
        {
          q: 'How fast is turnaround?',
          a: 'Fast for single parts; longer for complex assemblies.',
        },
        {
          q: 'Who owns the model?',
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
