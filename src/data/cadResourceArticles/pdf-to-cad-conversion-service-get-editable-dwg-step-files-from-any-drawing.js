/** @type {import('./schema').CadResourceArticle} */
export const pdfToCadConversionServiceArticle = {
  slug: 'pdf-to-cad-conversion-service-get-editable-dwg-step-files-from-any-drawing',
  breadcrumbLastLabel: 'PDF to CAD conversion service',
  metadata: {
    title: 'PDF to CAD Conversion Service — Editable DWG, DXF & STEP | Marathon OS',
    description:
      'Convert PDF drawings to editable CAD: DWG/DXF, clean PDF exports, and STEP when 3D reconstruction is required. Vetted drafters, revisions included—submit your files and scope.',
  },
  hero: {
    badge: 'CAD Services · Conversion',
    title: 'PDF to CAD Conversion Service — Fast, Accurate, Production-Ready',
    lead:
      'Submit your brief. Get matched with a vetted expert. Receive DWG/DXF, STEP (if 3D reconstruction is required), and clean PDF exports for manufacturing, documentation, or coordination.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A PDF-to-CAD conversion service recreates editable geometry and sheets from PDFs or scans—typically DWG/DXF (and STEP when true 3D is needed). Quality depends on source clarity, scope of layers/standards, and whether the goal is fabrication-ready linework or a quick editable underlay.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-pdf-cad',
      title: 'What is PDF to CAD conversion?',
      paragraphs: [
        'PDF to CAD conversion is a deliverable-focused service: you’re hiring for editable outputs, not a static print. The goal is accurate linework, usable layers where required, and export formats your shop or team can revise—without redrawing everything yourself.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you use PDF to CAD conversion?',
      cards: [
        {
          icon: '📄',
          title: 'You have a PDF drawing',
          body: 'Convert it into editable CAD for updates.',
        },
        {
          icon: '🧱',
          title: 'You need fabrication files',
          body: 'Shops often require DWG/DXF for quoting.',
        },
        {
          icon: '🏗️',
          title: 'You’re renovating or updating plans',
          body: 'Bring legacy drawings into editable format.',
        },
        {
          icon: '🔁',
          title: 'You need redline updates',
          body: 'Make changes cleanly in CAD rather than PDF markup.',
        },
        {
          icon: '🧩',
          title: 'You need 3D reconstruction',
          body: 'Rebuild in 3D when only 2D references exist.',
        },
        {
          icon: '⏱️',
          title: 'You need speed',
          body: 'Get clean CAD quickly without doing redraw work.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a PDF to CAD conversion provider',
      blocks: [
        {
          title: 'Output formats',
          body: 'Confirm DWG/DXF, PDF sets, and whether STEP or native 3D is in scope.',
        },
        {
          title: 'Production readiness',
          body: 'Ask whether deliverables are suitable for quoting and fabrication—not just traced lines.',
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
          body: 'For drawings: dimensions, scale, and layer standards. For 3D: solid integrity and key interfaces.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'conversion-options',
      title: 'Auto-trace vs freelancer vs managed service',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'Auto-tracing tools',
          col2: 'Quick',
          col3: 'Low accuracy',
          col4: 'Simple sketches',
        },
        {
          label: 'Freelancer',
          col2: 'Flexible',
          col3: 'Quality variance',
          col4: 'Simple one-offs',
        },
        {
          label: 'Managed service',
          col2: 'QA + predictable',
          col3: 'Needs clear inputs',
          col4: 'Accurate editable CAD',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for this deliverable',
      paragraphs: [
        'Attach the PDF (vector preferred; high-resolution scans if not), note sheet scale, required layers or company standards, which views must be recreated, and whether you need 2D only or 3D/STEP reconstruction. List target exports and deadline.',
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
          q: 'Will the output be editable?',
          a: 'Yes—DWG/DXF outputs are editable.',
        },
        {
          q: 'Can you handle scanned PDFs?',
          a: 'Yes—quality affects time; provide the best scan available.',
        },
        {
          q: 'Do you recreate layers?',
          a: 'If you have standards, we can match; otherwise we apply clean defaults.',
        },
        {
          q: 'Can you rebuild in 3D?',
          a: 'Yes—if you need STEP/3D, specify it and provide dimensions.',
        },
        {
          q: 'Are revisions included?',
          a: 'Yes—revision rounds are included.',
        },
        {
          q: 'Who owns the converted files?',
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
