/** @type {import('./schema').CadResourceArticle} */
export const cadDesignBriefGuideArticle = {
  slug: 'how-to-write-a-cad-design-brief-templates-and-tips-for-getting-accurate-quotes',
  breadcrumbLastLabel: 'How to write a CAD design brief',
  metadata: {
    title: 'How to Write a CAD Design Brief: Templates & Tips | Marathon OS',
    description:
      'Write CAD briefs that get accurate quotes: checklist, example prompts, dimensions, formats, and manufacturing context—fewer revisions and faster delivery.',
  },
  hero: {
    badge: 'CAD Guides · Briefing',
    title: 'How to Write a CAD Design Brief: Templates and Tips for Getting Accurate Quotes',
    lead:
      'A clear brief turns ambiguity into a scoped quote—what you are building, how it must perform, and exactly which CAD outputs you need.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A strong CAD design brief states the product or drawing scope, key dimensions, function, interfaces, target manufacturing or printing process, required file formats, deadline, and acceptance criteria. The more specific you are, the fewer revision cycles you pay for.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-brief',
      title: 'What is a CAD design brief?',
      paragraphs: [
        'A CAD design brief is the written agreement of intent before modeling or drafting starts: it aligns you and the designer on deliverables, standards, and success criteria so quotes reflect real work—not guesswork.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you invest in a better CAD brief?',
      cards: [
        {
          icon: '🧾',
          title: 'You want accurate quotes',
          body: 'A strong brief reduces uncertainty and cost.',
        },
        {
          icon: '🔁',
          title: 'You want fewer revisions',
          body: 'Clarity prevents rework.',
        },
        {
          icon: '🏭',
          title: 'You’re going to manufacturing',
          body: 'Suppliers need specific file types and details.',
        },
        {
          icon: '🧪',
          title: 'You’re prototyping',
          body: 'Print/CNC constraints need to be stated.',
        },
        {
          icon: '🧩',
          title: 'You have assemblies',
          body: 'Interfaces and mates need to be described.',
        },
        {
          icon: '⏱️',
          title: 'You need speed',
          body: 'Good briefs unlock faster delivery.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to include in every CAD brief',
      blocks: [
        {
          title: 'Deliverable list',
          body: 'Native CAD, STEP/IGES, DWG/DXF, STL, PDF drawing set—spell out exactly what you need.',
        },
        {
          title: 'Production readiness',
          body: 'State whether outputs must be shop-ready or concept-level.',
        },
        {
          title: 'Revision policy expectations',
          body: 'Note how many feedback rounds you expect and how you will review.',
        },
        {
          title: 'IP ownership + NDA',
          body: 'Confirm you will own deliverables and that confidentiality is covered.',
        },
        {
          title: 'Quality checks',
          body: 'Call out critical fits, tolerances, materials, and standards (ASME, ISO, company templates).',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'brief-styles',
      title: 'Short vague brief vs structured template',
      rowLabelHeader: 'Option',
      column2Header: 'Pros',
      column3Header: 'Cons',
      column4Header: 'Best for',
      rows: [
        {
          label: 'Short vague brief',
          col2: 'Fast to write',
          col3: 'More revisions',
          col4: 'Early brainstorming',
        },
        {
          label: 'Structured template',
          col2: 'Clear',
          col3: 'Takes minutes',
          col4: 'Accurate quotes + delivery',
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
          q: 'What’s the minimum to include?',
          a: 'What it is, key dimensions, function, and required output formats.',
        },
        {
          q: 'Do I need a CAD file to start?',
          a: 'No—sketches/photos + dimensions can be enough.',
        },
        {
          q: 'Should I specify manufacturing process?',
          a: 'Yes—CNC/printing/fabrication changes design assumptions.',
        },
        {
          q: 'How do I reduce revisions?',
          a: 'Add references, clear constraints, and acceptance criteria.',
        },
        {
          q: 'Should I mention tolerances?',
          a: 'Yes—when important for fit/function.',
        },
        {
          q: 'Can I use a template?',
          a: 'Yes—use a consistent checklist for every project.',
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
