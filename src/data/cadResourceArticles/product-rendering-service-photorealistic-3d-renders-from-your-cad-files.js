/** @type {import('./schema').CadResourceArticle} */
export const productRenderingServiceArticle = {
  slug: 'product-rendering-service-photorealistic-3d-renders-from-your-cad-files',
  breadcrumbLastLabel: 'Product rendering service',
  metadata: {
    title: 'Product Rendering Service — Production-Ready Deliverables | Marathon OS',
    description:
      'Get product rendering from vetted CAD experts. Receive high-res PNG/JPG renders, scene files (optional), turntable (optional). Submit your brief and get high-quality deliverables fast—without managing freelancers.',
  },
  hero: {
    badge: 'CAD Services · Visualization',
    title: 'Product Rendering Service — Fast, Accurate, Production-Ready',
    lead:
      'Submit your brief. Get matched with a vetted expert. Receive high-res PNG/JPG renders, scene files (optional), turntable (optional) for marketing, pitch decks, ecommerce, or design review.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'No contracts. No bidding. Defined deliverables + revisions.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A product rendering service produces visualization deliverables—high-res PNG/JPG renders, scene files (optional), turntable (optional)—from your CAD or 3D data. The best providers clarify look-dev upfront, deliver files ready for web and print, include revisions, and protect your IP with clear ownership.',
      ],
    },
    {
      type: 'prose',
      id: 'what-is-rendering',
      title: 'What is product rendering?',
      paragraphs: [
        'Product rendering is a deliverable-focused service: you’re hiring for pixels and motion that sell the design—not for a CAD tool license. The goal is consistent, photorealistic imagery (and optional turntables) that match materials, lighting, and brand—aligned with your CAD so updates stay in sync.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'when-use',
      title: 'When should you use product rendering?',
      cards: [
        {
          icon: '🛍️',
          title: 'Marketing visuals',
          body: 'Create photorealistic renders for launches and listings.',
        },
        {
          icon: '🎨',
          title: 'Concept exploration',
          body: 'Try finishes, colors, and materials before production.',
        },
        {
          icon: '📦',
          title: 'Packaging & lifestyle shots',
          body: 'Generate visuals without costly photoshoots.',
        },
        {
          icon: '🔁',
          title: 'Iteration',
          body: 'Update renders as the CAD changes.',
        },
        {
          icon: '📐',
          title: 'Engineering-to-marketing handoff',
          body: 'Keep visuals consistent with design intent.',
        },
        {
          icon: '🧩',
          title: 'Exploded/assembly views',
          body: 'Show components and product detail clearly.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'what-to-look-for',
      title: 'What to look for in a product rendering provider',
      blocks: [
        {
          title: 'Output formats',
          body: 'Confirm exactly what files you’ll receive (high-res PNG/JPG renders, scene files (optional), turntable (optional)).',
        },
        {
          title: 'Production readiness',
          body: 'Ask whether outputs meet your resolution, color profile, and channel specs (web, print, Amazon, etc.).',
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
          body: 'For renders: lighting consistency, material accuracy, edge/detail fidelity, and alignment with supplied CAD.',
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
          label: 'DIY rendering',
          col2: 'Full control',
          col3: 'Time/skill',
          col4: 'Experienced artists',
        },
        {
          label: 'Freelancer',
          col2: 'Flexible',
          col3: 'Quality variance',
          col4: 'Known trusted renderers',
        },
        {
          label: 'Managed service',
          col2: 'Reliable output',
          col3: 'Needs clear brief',
          col4: 'Consistent render sets',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-deliverable',
      title: 'How to write a brief for this deliverable',
      paragraphs: [
        'Include product context, target audience, resolution and aspect ratio, background style, key shots (hero, three-quarter, exploded), material/finish references, brand colors, and deliverables (PNG/JPG, turntable length, optional scene files). Attach CAD, STEP, or reference images.',
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
          body: 'You receive final renders plus optional scene or turntable deliverables. Revisions are included.',
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
          q: 'Do you need my CAD files?',
          a: 'Yes—CAD files or 3D exports work best.',
        },
        {
          q: 'What do I receive?',
          a: 'High-res PNG/JPG; turntables or scene files if requested.',
        },
        {
          q: 'Can you match materials?',
          a: 'Yes—provide references for finishes and colors.',
        },
        {
          q: 'Can you do exploded views?',
          a: 'Yes—specify what you want shown.',
        },
        {
          q: 'Are revisions included?',
          a: 'Yes—revision rounds are included.',
        },
        {
          q: 'Who owns the renders?',
          a: 'You do—deliverables belong to you.',
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
