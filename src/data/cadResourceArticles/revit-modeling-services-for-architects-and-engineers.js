/** @type {import('./schema').CadResourceArticle} */
export const revitModelingServicesArticle = {
  slug: 'revit-modeling-services-for-architects-and-engineers',
  breadcrumbLastLabel: 'Revit modeling services',
  metadata: {
    title: 'Revit Design Service — Vetted Revit Experts | Marathon OS',
    description:
      'Hire a vetted Revit designer online. Get native RVT files plus exports like DWG, PDF, IFC (if requested). Submit your brief and receive production-ready deliverables fast.',
  },
  hero: {
    badge: 'CAD Services · Revit',
    title: 'Hire a Revit Designer Online — Production-Ready Files Fast',
    lead:
      'Submit your brief. Get matched with a vetted Revit expert. Receive native RVT + exports for documentation, coordination, and stakeholder review.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No profile browsing. No bidding. Clear deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'Hiring a Revit designer online means submitting your brief to a service that matches you with a qualified Revit modeler or drafter. The best services deliver native files plus exports for consultants, contractors, and stakeholders, with clear timelines and revision rounds.',
      ],
    },
    {
      type: 'prose',
      id: 'what-designer-does',
      title: 'What does a Revit designer do?',
      paragraphs: [
        'A Revit designer creates accurate BIM models and construction documentation in Revit, producing files that can go directly into design development, permit sets, coordination, and stakeholder review. The key is deliverables: consistent families and views, correct annotations, and exports your partners can use.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-hire',
      title: 'When should you hire a Revit designer?',
      intro:
        'You should hire a Revit designer when you need work delivered in Revit specifically—either because your team uses it downstream or because your vendor requires it.',
      cards: [
        {
          icon: '🏗️',
          title: 'BIM modeling',
          body: 'Create or update Revit models for architectural/engineering workflows.',
        },
        {
          icon: '📐',
          title: 'Documentation',
          body: 'Generate sheets, views, and documentation outputs.',
        },
        {
          icon: '🔁',
          title: 'Design updates',
          body: 'Apply revisions from clients and consultants.',
        },
        {
          icon: '🧩',
          title: 'Coordination support',
          body: 'Model key elements to reduce clashes and miscommunication.',
        },
        {
          icon: '🧱',
          title: 'As-builts',
          body: 'Update models based on field conditions and redlines.',
        },
        {
          icon: '📤',
          title: 'Export deliverables',
          body: 'Provide RVT plus exchange exports as needed.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a Revit design service',
      blocks: [
        {
          title: 'Proven tool proficiency',
          body: 'Look for experience with real production deliverables—not just concept modeling.',
        },
        {
          title: 'Deliverable formats',
          body: 'Confirm you’ll receive native files (RVT) plus exports (DWG, PDF, IFC (if requested)).',
        },
        {
          title: 'Modeling standards',
          body: 'Ask for clean naming, families, views, and documentation practices.',
        },
        {
          title: 'Timeline + revisions',
          body: 'Confirm turnaround and included revision rounds.',
        },
        {
          title: 'IP + confidentiality',
          body: 'Ensure you own the output and NDA coverage is available.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'freelancer-vs-service',
      title: 'Freelancer vs. tool-specific service',
      rowLabelHeader: 'Criteria',
      column2Header: 'Freelancer',
      column3Header: 'Revit Service (Marathon OS)',
      rows: [
        { label: 'Vetting', col2: 'Self-managed', col3: 'Vetted Revit modelers' },
        { label: 'Start time', col2: 'Search', col3: 'Submit brief' },
        { label: 'Deliverables', col2: 'Variable', col3: 'RVT + requested exports' },
        { label: 'Revisions', col2: 'Variable', col3: 'Defined policy' },
        { label: 'IP/NDA', col2: 'You negotiate', col3: 'Included' },
      ],
    },
    {
      type: 'prose',
      id: 'revit-brief',
      title: 'How to write a Revit brief',
      paragraphs: [
        'Include: scope (discipline, level of detail), critical dimensions, how the model interfaces with linked models or consultants, assumptions about standards, and the exact outputs you need (native RVT + DWG/PDF/IFC). Attach sketches, reference photos, or legacy files if available.',
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
      stepCtaLabel: 'Start Your Revit Project',
    },
    {
      type: 'pillGrid',
      id: 'project-types',
      title: 'What projects fit this service?',
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
          q: 'Do you deliver RVT files?',
          a: 'Yes—RVT plus requested exports.',
        },
        {
          q: 'Can you work from PDFs or redlines?',
          a: 'Yes—redlines and reference files work well.',
        },
        {
          q: 'Do you support documentation sets?',
          a: 'Yes—views/sheets can be produced per scope.',
        },
        {
          q: 'Is IFC available?',
          a: 'If you need IFC exports, specify it in the brief.',
        },
        {
          q: 'Who owns the model?',
          a: 'You do—deliverables belong to you; NDA coverage included.',
        },
        {
          q: 'How fast is delivery?',
          a: 'Depends on model size and scope; timelines are confirmed upfront.',
        },
      ],
    },
  ],
  bottomCta: {
    title: 'Need a Revit designer?',
    sub: 'Describe your project in minutes. Get matched with a vetted Revit expert and receive production-ready files fast.',
    primaryCtaLabel: 'Start Your Project',
    learnMoreHref: '/cad-services',
    learnMoreLabel: 'Learn more about Marathon OS CAD Services →',
  },
}
