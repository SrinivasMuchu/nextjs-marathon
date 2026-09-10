/**
 * Approved unique copy from step-stl-report.xlsx for dedicated CAD viewer pages.
 * Do not apply this copy to the generic /tools/3d-cad-viewer hub.
 */

export const UNIQUE_VIEWER_PAGES = {
  step: {
    breadcrumbLabel: 'STEP File Viewer',
    meta: {
      description:
        'Open and inspect STEP or STP product models online without installing CAD software. Preview compatible solids, surfaces and assemblies securely in your browser before conversion, supplier review or manufacturing handoff.',
    },
    eyebrow: 'Free online tool',
    h1: 'Free Online STEP File Viewer',
    heroIntro:
      'Open and inspect STEP or STP product models online without installing CAD software. Preview compatible solids, surfaces and assemblies securely in your browser before conversion, supplier review or manufacturing handoff.',
    trust: [
      'Free online viewer',
      'Private uploads',
      'Up to 300 MB',
      'Auto-delete within 7 days',
      'No CAD software needed',
    ],
    dropzoneHead: 'Drag and drop your STEP file here',
    dropzoneHint: 'or click to browse files',
    supportedInputLabel: '.step, .stp',
    samplePrompt: 'No STEP file available? Open a verified sample model.',
    sampleCta: 'Try a sample STEP',
    sampleFormat: 'step',
    designerTitle: 'Need a production-ready native CAD file?',
    designerBody:
      'A viewer can inspect geometry but cannot rebuild features, repair missing faces or add manufacturing detail. Work with a vetted designer when the model needs engineering changes.',
    designerCta: 'Hire a CAD designer',
    definitionHeading: 'What is a STEP file viewer?',
    definitionBody:
      'A STEP viewer opens the neutral ISO 10303 exchange format so you can visually inspect product geometry without the authoring CAD system. It is useful for checking imported solids, surfaces and assemblies, but it does not restore the original native feature tree.',
    useCasesHeading: 'When to use this viewer',
    useCasesIntro:
      'Use it to review a supplier model, confirm a download, check a converted file, inspect an assembly or decide whether a STEP file is suitable for CAD/CAM, quoting or manufacturing review.',
    checklistHeading: 'What to check before using the file',
    checklist: [
      'Overall shape and orientation',
      'Known dimensions and unit interpretation',
      'Expected bodies, components and assembly structure',
      'Missing faces, gaps or open shells',
      'Whether the receiving CAD/CAM system opens the same geometry',
    ],
    relatedHeading: 'Related tools',
    relatedTools: [
      {
        title: 'STEP to STL',
        description: 'create a printable mesh',
        href: '/tools/convert-step-to-stl',
      },
      {
        title: 'STEP to IGES',
        description: 'create a legacy surface exchange file',
        href: '/tools/convert-step-to-iges',
      },
      {
        title: 'STL to STEP',
        description: 'inspect a mesh-derived STEP result',
        href: '/tools/convert-stl-to-step',
      },
      {
        title: '3DM to STEP',
        description: 'verify a Rhino-to-STEP handoff',
        href: '/tools/convert-3dm-to-step',
      },
    ],
    converterHeading: 'Need to convert the file?',
    converterBody:
      'Use the CAD converter when the next application needs STL, IGES, 3DM or another supported format. Conversion changes the container and may not preserve native features or metadata.',
    converterCta: 'Convert 3D CAD files',
    converterHref: '/tools/3d-cad-file-converter',
    resourcesHeading: 'Explore Marathon OS CAD resources',
    resourcesIntro:
      'Preview a model, find an existing design, open a technical drawing or get specialist help.',
    resources: [
      { label: 'Browse CAD models', href: '/library', icon: 'box' },
      { label: 'Browse 2D drawings', href: '/library/2d-technical-drawings', icon: 'file' },
      { label: 'Get CAD design support', href: '/cad-services', icon: 'headset' },
    ],
    workflowEyebrow: 'HOW IT WORKS',
    workflowHeading: 'How to view STEP files online',
    workflowIntro: 'No downloads or plugins. Inspect the model directly in a modern browser.',
    workflowSteps: [
      {
        title: 'Upload your STEP file',
        description: 'Drag and drop or browse for .step, .stp. Files up to 300 MB are supported.',
      },
      {
        title: 'Preview in your browser',
        description:
          'Rotate, zoom and pan around the model. Confirm that expected solids, surfaces and assembly components appear and that the orientation looks correct.',
      },
      {
        title: 'Decide the next action',
        description:
          'If the geometry looks correct, continue with the target workflow. If another format is required, convert it; if geometry is missing or damaged, repair the source or request design help.',
      },
    ],
    workflowCta: 'Upload STEP file',
    workflowCtaHref: '#cad-file-viewer',
    workflowSecondaryCta: 'Open the CAD converter',
    workflowSecondaryHref: '/tools/3d-cad-file-converter',
    capabilitiesHeading: 'What you can inspect in STEP',
    capabilities: [
      'Overall solids, surfaces and visible product shape',
      'Separate bodies or assembly components where supported',
      'Orientation and relative placement',
      'Unexpected gaps, missing faces or empty results',
      'Scale by comparing a known dimension in the receiving workflow',
    ],
    limitationsHeading: 'What this viewer does not do',
    limitations: [
      'Edit sketches, constraints or parametric features',
      'Guarantee manufacturing readiness or tolerance accuracy',
      'Recover proprietary history from SolidWorks, Inventor, Creo or another authoring tool',
      'Repair gaps or create missing surfaces',
      'Guarantee complete PMI, GD&T, materials or metadata support',
    ],
    whyHeading: 'Why use Marathon OS CAD Viewer',
    whyIntro:
      'Open a file quickly without installing a large desktop application, then decide whether it is ready to share, convert or repair.',
    whyCards: [
      {
        icon: 'zap',
        title: 'Instant preview',
        description: 'Open and inspect supported geometry in the browser.',
      },
      {
        icon: 'layers',
        title: 'STEP-focused inspection',
        description:
          'Review STEP/STP exchange geometry and assembly content before moving it into CAD/CAM, conversion or supplier workflows.',
      },
      {
        icon: 'users',
        title: 'Faster review',
        description: 'Use the same browser-based inspection step before conversion, quoting or supplier handoff.',
      },
      {
        icon: 'monitorSmartphone',
        title: 'Anywhere access',
        description:
          'Use a modern browser on desktop, tablet or mobile; complex files are easiest to inspect on a larger screen.',
      },
    ],
    preflightEyebrow: 'BEFORE THE NEXT WORKFLOW',
    preflightHeading: 'Checks to make before using a STEP file',
    preflightIntro:
      'A model that opens can still contain scale, topology or completeness problems. Record these checks before manufacturing or conversion.',
    preflight: [
      [
        'Confirm units and dimensions',
        'STEP can carry units, but import settings still matter. Measure a known feature in the receiving application.',
      ],
      [
        'Check body status',
        'Identify valid solids, closed shells, open shells and loose surfaces.',
      ],
      [
        'Review assembly completeness',
        'Confirm expected components, instances and relative positions where assembly structure is supported.',
      ],
      [
        'Inspect edges and faces',
        'Look for gaps, sliver faces, missing trims and import errors.',
      ],
      [
        'Check orientation and origin',
        'Confirm axis orientation and placement before CAM or downstream assembly use.',
      ],
      [
        'Test the target system',
        'Open the file in the exact CAD/CAM application used next; browser inspection is an early check, not final acceptance.',
      ],
    ],
    troubleEyebrow: 'COMMON PROBLEMS',
    troubleHeading: 'STEP viewer troubleshooting',
    troubleIntro:
      'STEP viewing issues usually come from unsupported entities, damaged topology, large assemblies, import tolerances or a file that was exported incorrectly.',
    problems: [
      {
        title: 'The model is blank or incomplete',
        description: 'Cause: The file contains unsupported entities or missing geometry.',
        fix: 'Re-export as a widely compatible STEP application protocol and confirm it opens in the source CAD system.',
      },
      {
        title: 'Some components are missing',
        description: 'Cause: The source export omitted parts or the assembly structure did not translate.',
        fix: 'Create a complete STEP export and compare the component count.',
      },
      {
        title: 'The model has gaps or open faces',
        description: 'Cause: Trimmed surfaces did not sew within tolerance.',
        fix: 'Heal the geometry in CAD or request a repaired source file.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: Units or scaling were interpreted differently downstream.',
        fix: 'Measure a known feature and confirm the STEP unit settings.',
      },
      {
        title: 'A large assembly is slow',
        description: 'Cause: Many components and highly detailed faces increase parsing and rendering load.',
        fix: 'Try a simplified configuration or export only the required subassembly.',
      },
      {
        title: 'I cannot edit features',
        description: 'Cause: STEP is an exchange format and the viewer is read-only.',
        fix: 'Use direct editing in CAD or obtain the native authoring file.',
      },
    ],
    privacyHeading: 'Privacy and file handling',
    privacyIntro:
      'Product models can contain confidential engineering information. Keep file handling clear beside the upload action and in the FAQ.',
    privacyItems: [
      {
        title: 'Private uploads',
        description: 'Files are processed privately and are not added to the public CAD library.',
      },
      {
        title: 'Automatic deletion',
        description: 'Uploaded files are automatically deleted within 7 days.',
      },
      {
        title: 'You retain ownership',
        description: 'Viewing a file does not transfer ownership of the design to Marathon OS.',
      },
    ],
    audienceHeading: 'Who the STEP viewer is for',
    audience: [
      'Mechanical engineers reviewing supplier files',
      'Manufacturing teams checking models before quoting',
      'Design teams validating converted STEP output',
      'Students and buyers without the authoring CAD system',
      'CAD/CAM users making an initial geometry check',
    ],
    designHubHeading: 'Find a model before building from scratch',
    designHubIntro:
      'Browse the Marathon OS library for a potential starting point. Review dimensions, licensing and production suitability before use.',
    designHubCta: 'Browse CAD models',
    faqHeading: 'Frequently asked questions about the STEP viewer',
    faqIntro: 'Answers about supported files, inspection limits, conversion, file size and privacy.',
    faqs: [
      {
        question: 'How do I open STEP files online?',
        answer:
          'Upload .step, .stp, wait for the browser preview, then zoom, pan, rotate and inspect the model. No desktop CAD installation is required.',
      },
      {
        question: 'Which STEP extensions are supported?',
        answer: 'This page accepts .step, .stp files up to 300 MB.',
      },
      {
        question: 'Can I edit the STEP file in this viewer?',
        answer:
          'No. The viewer is for inspection. Use a CAD application or design service when geometry, features or dimensions must be changed.',
      },
      {
        question: 'Does a STEP file contain editable features?',
        answer:
          'STEP can contain precise solids, surfaces, assemblies and product data, but it normally does not carry the original application’s parametric feature history. This viewer is read-only.',
      },
      {
        question: 'Can I convert STEP to another format?',
        answer:
          'Yes. Use dedicated routes such as STEP to STL for 3D printing or STEP to IGES for legacy surface exchange, then verify the result.',
        links: [
          { label: 'STEP to STL', href: '/tools/convert-step-to-stl' },
          { label: 'STEP to IGES', href: '/tools/convert-step-to-iges' },
        ],
        cta: 'Open CAD converter',
        ctaHref: '/tools/3d-cad-file-converter',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'You can upload one supported file up to 300 MB. Large and complex models may take longer to render.',
      },
      {
        question: 'How are uploaded files handled?',
        answer:
          'Files are processed privately, are not published to the CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    finalHeading: 'Open your STEP file online',
    finalBody:
      'Upload .step or .stp to inspect the model before converting, quoting or passing it to the next engineering workflow.',
    finalCta: 'Upload STEP file',
    finalCtaHref: '#cad-file-viewer',
    finalSecondaryCta: 'Open the CAD converter',
    finalSecondaryHref: '/tools/3d-cad-file-converter',
  },
}

export function getUniqueViewerPage(cadType) {
  const key = String(cadType || '').toLowerCase()
  return UNIQUE_VIEWER_PAGES[key] || null
}
