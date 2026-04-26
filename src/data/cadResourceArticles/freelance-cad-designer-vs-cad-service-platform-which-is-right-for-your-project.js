/** @type {import('./schema').CadResourceArticle} */
export const freelanceVsPlatformArticle = {
  slug: 'freelance-cad-designer-vs-cad-service-platform-which-is-right-for-your-project',
  breadcrumbLastLabel: 'Freelancer vs. CAD platform',
  metadata: {
    title: 'Freelance CAD Designer vs CAD Service Platform (Comparison) | Marathon OS',
    description:
      'Compare freelancers vs managed CAD services across vetting, timelines, revisions, and IP. Choose the best option for your project and get production-ready files fast.',
  },
  hero: {
    badge: 'CAD Services · Guide',
    title: 'Freelance CAD Designer vs. CAD Service Platform',
    lead:
      'Not sure whether to hire a freelancer or use a managed CAD service? Here’s how to choose based on speed, risk, complexity, and deliverables.',
    primaryCtaLabel: 'Describe Your Project',
    supportLine: 'Skip the uncertainty: vetted designers + defined deliverables.',
  },
  sections: [
    {
      type: 'quickAnswer',
      paragraphs: [
        'A freelance CAD designer is an individual contractor you hire directly. A CAD service platform is a managed service that matches you with vetted designers and delivers defined outputs. Freelancers can be great for long-term relationships, while platforms reduce risk and speed up delivery for production-ready files.',
      ],
    },
    {
      type: 'prose',
      id: 'difference',
      title: 'What’s the difference between a freelance CAD designer and a service platform?',
      paragraphs: [
        'Freelancers are self-managed: you find, vet, and coordinate. Platforms provide process: pre-vetted talent, clearer timelines, and built-in revision/IP policies.',
      ],
    },
    {
      type: 'cardGrid',
      id: 'signals',
      title: 'When should you choose a freelancer vs. a platform?',
      cards: [
        {
          icon: '⏱️',
          title: 'You need it fast',
          body: 'Platforms start in minutes; freelancer search can take days.',
        },
        {
          icon: '📦',
          title: 'You need defined deliverables',
          body: 'Platforms standardize outputs and revisions.',
        },
        {
          icon: '🧑‍🔧',
          title: 'You want a long-term relationship',
          body: 'Freelancers work well if you already know the right person.',
        },
        {
          icon: '💬',
          title: 'You need heavy collaboration',
          body: 'Freelancers can be great if availability and communication are strong.',
        },
        {
          icon: '🔒',
          title: 'You need NDA + ownership by default',
          body: 'Platforms often bake this in.',
        },
        {
          icon: '💸',
          title: 'You’re optimizing for lowest cost',
          body: 'Freelancers may be cheaper—but risk/variance increases.',
        },
      ],
    },
    {
      type: 'criteria',
      id: 'decision-framework',
      title: 'How to choose (quick decision framework)',
      blocks: [
        {
          title: 'Timeline',
          body: 'If you need deliverables in 24–48 hours, a platform is usually better.',
        },
        {
          title: 'Risk tolerance',
          body: 'If you can’t risk delays or low-quality outputs, use vetted services.',
        },
        {
          title: 'Complexity',
          body: 'For complex projects, choose the option that provides the best communication and QA.',
        },
        {
          title: 'Deliverables',
          body: 'Confirm native files + exports and a revision policy upfront.',
        },
        {
          title: 'IP + confidentiality',
          body: 'Make sure ownership and NDA terms are clear before sharing designs.',
        },
      ],
    },
    {
      type: 'comparisonTable',
      id: 'side-by-side',
      title: 'Freelancer vs platform — side-by-side',
      rowLabelHeader: 'Criteria',
      column2Header: 'Freelancer',
      column3Header: 'Managed CAD Service (Marathon OS)',
      rows: [
        { label: 'Vetting', col2: 'You do it', col3: 'Pre-vetted team' },
        { label: 'Start time', col2: 'Days', col3: 'Minutes' },
        { label: 'Turnaround', col2: 'Varies', col3: 'Defined targets' },
        { label: 'Revisions', col2: 'Variable', col3: 'Defined policy' },
        { label: 'IP/NDA', col2: 'You negotiate', col3: 'Included' },
        {
          label: 'Best for',
          col2: 'Long-term collaboration',
          col3: 'Fast, production-ready deliverables',
        },
      ],
    },
    {
      type: 'prose',
      id: 'brief-either-way',
      title: 'How to write a brief either way',
      paragraphs: [
        'Even with a freelancer, your brief drives results: include dimensions, interfaces, function, required outputs, and reference images. Clear briefs reduce time and revisions.',
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
      title: 'Project types we support',
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
          q: 'Are freelancers cheaper?',
          a: 'Sometimes, but variance is high. Total cost includes time spent vetting and managing.',
        },
        {
          q: 'What’s the fastest option?',
          a: 'A managed service is typically fastest to start and deliver.',
        },
        {
          q: 'What if I need multiple revisions?',
          a: 'Choose an option with a clear revision policy.',
        },
        {
          q: 'Do I own the deliverables?',
          a: 'You should—confirm IP assignment in writing.',
        },
        {
          q: 'Can a platform handle complex work?',
          a: 'Yes—complexity affects timeline; clarify scope early.',
        },
        {
          q: 'What should I choose for a one-off project?',
          a: 'Usually a managed service for speed and predictability.',
        },
      ],
    },
  ],
  bottomCta: {
    title: 'Want production-ready CAD without managing freelancers?',
    sub: 'Submit your brief and get matched with a vetted designer—fast delivery, revisions included.',
    primaryCtaLabel: 'Start Your Project',
    learnMoreHref: '/cad-services',
    learnMoreLabel: 'Learn more about Marathon OS CAD Services →',
  },
}
