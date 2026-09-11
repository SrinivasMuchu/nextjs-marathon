/**
 * Approved unique copy from step-stl-report.xlsx for dedicated CAD viewer pages.
 * Do not apply this copy to the generic /tools/3d-cad-viewer hub.
 */

export const UNIQUE_VIEWER_PAGES = {
  step: {
    breadcrumbLabel: 'STEP File Viewer',
    meta: {
      title: 'STEP File Viewer | Open STEP and STP Files Online | Marathon OS',
      description:
        'Open STEP and STP files online to inspect solids, surfaces and assemblies. Private browser-based viewing for files up to 300 MB, with no CAD software required.',
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
  iges: {
    breadcrumbLabel: 'IGES File Viewer',
    meta: {
      title: 'IGES File Viewer | Open IGES and IGS Files Online | Marathon OS',
      description:
        'Open IGES and IGS files online to inspect curves, surfaces and gaps. Private browser-based viewing for files up to 300 MB, with no CAD software required.',
    },
    eyebrow: 'Free online tool',
    h1: 'Free Online IGES File Viewer',
    heroIntro:
      'Open and inspect IGES or IGS surface models online without installing CAD software. Preview curves, wireframes and trimmed surfaces securely in your browser before repair, conversion or manufacturing handoff.',
    trust: [
      'Free online viewer',
      'Private uploads',
      'Up to 300 MB',
      'Auto-delete within 7 days',
      'No CAD software needed',
    ],
    dropzoneHead: 'Drag and drop your IGES file here',
    dropzoneHint: 'or click to browse files',
    supportedInputLabel: '.iges, .igs',
    samplePrompt: 'No IGES file available? Open a verified sample model.',
    sampleCta: 'Try a sample IGES',
    sampleFormat: 'iges',
    designerTitle: 'Need a production-ready native CAD file?',
    designerBody:
      'A viewer can inspect geometry but cannot rebuild features, repair missing faces or add manufacturing detail. Work with a vetted designer when the model needs engineering changes.',
    designerCta: 'Hire a CAD designer',
    definitionHeading: 'What is an IGES file viewer?',
    definitionBody:
      'An IGES viewer opens legacy Initial Graphics Exchange Specification files for visual inspection. It helps you review curves, wireframes and surface-based models, but it does not automatically sew gaps, repair trims or turn loose surfaces into a solid.',
    useCasesHeading: 'When to use this viewer',
    useCasesIntro:
      'Use it to review a legacy supplier file, confirm that an IGES export is complete, inspect a converted model or identify scale and surface problems before moving the geometry into STEP, CAD or CAM.',
    checklistHeading: 'What to check before using the file',
    checklist: [
      'Expected curves, surfaces and visible shape',
      'Known dimensions and unit interpretation',
      'Gaps, open edges and disconnected patches',
      'Reversed faces or failed trim boundaries',
      'Whether the receiving CAD/CAM tool supports the same IGES entities',
    ],
    relatedHeading: 'Related tools',
    relatedTools: [
      {
        title: 'IGES to STEP',
        description: 'move legacy surfaces into modern CAD exchange',
        href: '/tools/convert-iges-to-step',
      },
      {
        title: 'STEP to IGES',
        description: 'create an IGES handoff',
        href: '/tools/convert-step-to-iges',
      },
      {
        title: 'OBJ to IGES',
        description: 'inspect a mesh-derived surface result',
        href: '/tools/convert-obj-to-iges',
      },
      {
        title: 'STEP File Viewer',
        description: 'review a STEP alternative',
        href: '/tools/step-file-viewer',
      },
    ],
    converterHeading: 'Need to convert the file?',
    converterBody:
      'Use IGES to STEP when a current mechanical CAD system needs STEP, or choose another supported output in the CAD converter. Conversion cannot repair every damaged surface automatically.',
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
    workflowHeading: 'How to view IGES files online',
    workflowIntro: 'No downloads or plugins. Inspect the model directly in a modern browser.',
    workflowSteps: [
      {
        title: 'Upload your IGES file',
        description: 'Drag and drop or browse for .iges, .igs. Files up to 300 MB are supported.',
      },
      {
        title: 'Preview in your browser',
        description:
          'Rotate, zoom and pan around the geometry. Look for missing patches, loose curves, reversed faces and gaps between trimmed surfaces.',
      },
      {
        title: 'Decide the next action',
        description:
          'Convert clean geometry when another format is required. If the model has open edges or missing surfaces, repair the source before relying on the conversion.',
      },
    ],
    workflowCta: 'Upload IGES file',
    workflowCtaHref: '#cad-file-viewer',
    workflowSecondaryCta: 'Open the CAD converter',
    workflowSecondaryHref: '/tools/3d-cad-file-converter',
    capabilitiesHeading: 'What you can inspect in IGES',
    capabilities: [
      'Visible curves, wireframes and trimmed surfaces',
      'Overall orientation and model extents',
      'Missing or disconnected surface patches',
      'Open boundaries and unexpected gaps',
      'Whether legacy geometry is suitable for conversion',
    ],
    limitationsHeading: 'What this viewer does not do',
    limitations: [
      'Sew loose surfaces into a guaranteed solid',
      'Repair invalid trim loops or missing faces',
      'Recover native feature history or constraints',
      'Guarantee support for every legacy IGES entity',
      'Validate manufacturing tolerances or toolpaths',
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
        title: 'Surface-focused review',
        description:
          'Inspect legacy IGES/IGS geometry for gaps, missing faces and surface orientation before conversion or CAD/CAM use.',
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
    preflightHeading: 'Checks to make before using a IGES file',
    preflightIntro:
      'A model that opens can still contain scale, topology or completeness problems. Record these checks before manufacturing or conversion.',
    preflight: [
      [
        'Verify units and dimensions',
        'IGES may carry units, but exporters and importers can interpret settings differently. Measure a known feature.',
      ],
      [
        'Inspect all expected entities',
        'Confirm that surfaces, curves and wireframes exported by the source system are visible.',
      ],
      [
        'Find open edges and gaps',
        'Look for surface boundaries that do not meet or patches that are missing.',
      ],
      [
        'Review trims and orientation',
        'Check reversed faces, invalid trim loops and unexpected holes.',
      ],
      [
        'Determine body status downstream',
        'An IGES may display as a complete shape but still import as loose surfaces rather than a solid.',
      ],
      [
        'Test the target application',
        'Open the file in the exact CAD/CAM tool used next and compare the result.',
      ],
    ],
    troubleEyebrow: 'COMMON PROBLEMS',
    troubleHeading: 'IGES viewer troubleshooting',
    troubleIntro:
      'IGES problems are commonly caused by legacy entity support, loose tolerances, invalid trims, missing surfaces or inconsistent unit interpretation.',
    problems: [
      {
        title: 'The model has holes or gaps',
        description: 'Cause: Surface boundaries do not meet or a patch is missing.',
        fix: 'Heal/sew surfaces in CAD or request a repaired export.',
      },
      {
        title: 'Some curves or faces do not appear',
        description: 'Cause: The file uses unsupported or invalid IGES entities.',
        fix: 'Re-export using broadly supported curve and trimmed-surface types.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: The file unit or receiving application setting was interpreted differently.',
        fix: 'Measure a known feature and apply the intended unit.',
      },
      {
        title: 'Faces look reversed or dark',
        description: 'Cause: Surface orientation or trim direction is inconsistent.',
        fix: 'Repair normals/orientation in a CAD system before downstream use.',
      },
      {
        title: 'The file opens as loose surfaces',
        description: 'Cause: IGES does not guarantee connected solid topology.',
        fix: 'Convert to STEP and heal the result, or repair the IGES surfaces first.',
      },
      {
        title: 'A complex file is slow',
        description: 'Cause: Many patches, curves and legacy entities increase processing and rendering time.',
        fix: 'Export only required geometry or simplify unnecessary detail.',
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
    audienceHeading: 'Who the IGES viewer is for',
    audience: [
      'Engineers reviewing legacy supplier geometry',
      'CAD/CAM teams checking surfaces before import',
      'Manufacturing teams validating an exchange file',
      'Designers inspecting a conversion result',
      'Users without the original authoring software',
    ],
    designHubHeading: 'Find a model before building from scratch',
    designHubIntro:
      'Browse the Marathon OS library for a potential starting point. Review dimensions, licensing and production suitability before use.',
    designHubCta: 'Browse CAD models',
    faqHeading: 'Frequently asked questions about the IGES viewer',
    faqIntro: 'Answers about supported files, inspection limits, conversion, file size and privacy.',
    faqs: [
      {
        question: 'How do I open IGES files online?',
        answer:
          'Upload .iges, .igs, wait for the browser preview, then zoom, pan, rotate and inspect the model. No desktop CAD installation is required.',
      },
      {
        question: 'Which IGES extensions are supported?',
        answer: 'This page accepts .iges, .igs files up to 300 MB.',
      },
      {
        question: 'Can I edit the IGES file in this viewer?',
        answer:
          'No. The viewer is for inspection. Use a CAD application or design service when geometry, features or dimensions must be changed.',
      },
      {
        question: 'Will an IGES viewer show whether the model is a solid?',
        answer:
          'It can reveal visible gaps and missing surfaces, but definitive body status should be checked in the receiving CAD system. IGES often contains loosely connected surfaces.',
      },
      {
        question: 'Can I convert IGES to another format?',
        answer:
          'Yes. IGES to STEP is the most common route when a modern mechanical CAD workflow needs connected B-rep geometry or product structure. Always verify the converted body.',
        links: [{ label: 'IGES to STEP', href: '/tools/convert-iges-to-step' }],
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
    finalHeading: 'Open your IGES file online',
    finalBody:
      'Upload .iges or .igs to inspect legacy surface geometry before repair, conversion, quoting or CAD/CAM use.',
    finalCta: 'Upload IGES file',
    finalCtaHref: '#cad-file-viewer',
    finalSecondaryCta: 'Open the CAD converter',
    finalSecondaryHref: '/tools/3d-cad-file-converter',
  },
  '3d-cad-viewer': {
    isHub: true,
    breadcrumbLabel: '3D CAD Viewer',
    meta: {
      title: 'Free Online 3D CAD Viewer | STEP, IGES, STL, OBJ, 3DM | Marathon OS',
      description:
        'Open STEP, IGES, STL, OBJ, PLY, OFF, BREP and 3DM files online. Private browser-based viewing up to 300 MB, with no CAD software required.',
    },
    eyebrow: 'Free online tool',
    h1: 'Free Online 3D CAD Viewer',
    heroIntro:
      'Open STEP, IGES, STL, OBJ, PLY, OFF, BREP and 3DM files online without installing CAD software.',
    heroIntroSecondary:
      'Upload privately, rotate and inspect the model in 3D, then convert or request repair when the next workflow needs more than a preview.',
    trust: [
      'Free online viewer',
      '8 supported formats',
      'Up to 300 MB',
      'Auto-delete within 7 days',
      'No CAD software needed',
    ],
    dropzoneHead: 'Drag and drop your 3D CAD file here',
    dropzoneHint: 'or click to browse files',
    acceptedFormatsLabel: 'Accepted: .step, .stp, .iges, .igs, .stl, .obj, .ply, .off, .brep, .brp, .3dm',
    samplePrompt: 'No file available? Open a verified sample in one of the supported formats.',
    sampleCta: 'Try a sample model',
    sampleGallery: true,
    skipHeroDesigner: true,
    formatDirectoryHeading: 'Supported 3D CAD and mesh formats',
    formatDirectoryIntro: 'Choose a format-specific viewer when you need guidance tailored to the file you have.',
    formatDirectory: [
      {
        title: 'STEP (.step, .stp)',
        description: 'Product-model B-rep solids, surfaces and assemblies',
        cta: 'View STEP files',
        href: '/tools/step-file-viewer',
      },
      {
        title: 'IGES (.iges, .igs)',
        description: 'Legacy curves, wireframes and trimmed surfaces',
        cta: 'View IGES files',
        href: '/tools/iges-file-viewer',
      },
      {
        title: 'STL (.stl)',
        description: 'Triangular mesh used for 3D printing',
        cta: 'View STL files',
        href: '/tools/stl-file-viewer',
      },
      {
        title: 'OBJ (.obj)',
        description: 'Polygon mesh and visual asset exchange',
        cta: 'View OBJ files',
        href: '/tools/obj-file-viewer',
      },
      {
        title: 'PLY (.ply)',
        description: 'Polygon or point-cloud data',
        cta: 'View PLY files',
        href: '/tools/ply-file-viewer',
      },
      {
        title: 'OFF (.off)',
        description: 'Simple polygon geometry',
        cta: 'View OFF files',
        href: '/tools/off-file-viewer',
      },
      {
        title: 'BREP (.brep, .brp)',
        description: 'Boundary-representation faces, edges and solids',
        cta: 'View BREP files',
        href: '/tools/brep-file-viewer',
      },
      {
        title: '3DM (.3dm)',
        description: 'Rhino NURBS, B-reps, meshes and curves',
        cta: 'View 3DM files',
        href: '/tools/3dm-file-viewer',
      },
    ],
    viewerToolsHeading: 'Most-used CAD viewer tools',
    viewerTools: [
      { title: 'STEP File Viewer', description: 'inspect solids and assemblies', href: '/tools/step-file-viewer' },
      { title: 'STL File Viewer', description: 'review printable meshes', href: '/tools/stl-file-viewer' },
      { title: 'IGES File Viewer', description: 'check legacy surfaces', href: '/tools/iges-file-viewer' },
      { title: 'OBJ File Viewer', description: 'inspect polygon models', href: '/tools/obj-file-viewer' },
      { title: '3DM File Viewer', description: 'review Rhino geometry', href: '/tools/3dm-file-viewer' },
    ],
    designerTitle: 'Need a production-ready native CAD file?',
    designerBody:
      'Viewing confirms what is visible; it does not rebuild features, repair topology or add tolerances. Use a vetted CAD designer when the model needs engineering work.',
    designerCta: 'Hire a CAD designer',
    converterHeadingLevel: 2,
    converterHeading: 'View or convert: choose the right action',
    converterBody:
      'Use the viewer when you need to inspect the file you already have. Use the converter only when the next tool requires a different format. Use design support when geometry is damaged or must become a native editable model.',
    converterCta: 'Open CAD converter',
    converterHref: '/tools/3d-cad-file-converter',
    resourcesHeading: 'Explore Marathon OS CAD resources',
    resourcesIntro: 'Browse existing 3D models, review 2D drawings or request specialist design support.',
    resources: [
      { label: 'Browse CAD models', href: '/library', icon: 'box' },
      { label: 'Browse 2D drawings', href: '/library/2d-technical-drawings', icon: 'file' },
      { label: 'Get CAD design support', href: '/cad-services', icon: 'headset' },
    ],
    workflowEyebrow: 'HOW IT WORKS',
    workflowHeading: 'How to view CAD files online',
    workflowIntro: 'No downloads or plugins. Start with a supported file and inspect it in a modern browser.',
    workflowSteps: [
      {
        title: 'Upload a supported file',
        description: 'Choose one file up to 300 MB. The viewer detects the supported format from its content and extension.',
      },
      {
        title: 'Preview in 3D',
        description: 'Rotate, pan and zoom to check the overall shape, orientation and visible geometry.',
      },
      {
        title: 'Continue the workflow',
        description:
          'Keep the file when it is correct, convert it when another format is required or request repair when the geometry is incomplete.',
      },
    ],
    workflowCta: 'Upload CAD file',
    workflowCtaHref: '#cad-file-viewer',
    workflowSecondaryCta: 'Open converter',
    workflowSecondaryHref: '/tools/3d-cad-file-converter',
    capabilitiesHeading: 'What the online CAD viewer helps you check',
    capabilities: [
      'Overall shape and orientation',
      'Visible bodies, shells, surfaces or meshes',
      'Missing faces, gaps or disconnected parts',
      'Whether the file is suitable for the next conversion',
      'Basic supplier, quoting and design-review readiness',
    ],
    limitationsHeading: 'What the viewer does not replace',
    limitations: [
      'Native CAD feature editing',
      'Formal dimensional inspection or tolerance validation',
      'Mesh repair or surface healing',
      'Complete PMI, material or metadata review',
      'Final acceptance in the target CAD/CAM system',
    ],
    whyHeading: 'Why use Marathon OS CAD Viewer',
    whyIntro:
      'Inspect common exchange and mesh formats in one browser-based workflow before committing to conversion or design work.',
    whyCards: [
      {
        icon: 'zap',
        title: 'Instant preview',
        description: 'Open a supported file without installing a large desktop CAD application.',
      },
      {
        icon: 'layers',
        title: 'Format-specific paths',
        description: 'Move directly to STEP, IGES, STL, OBJ, PLY, OFF, BREP or 3DM guidance.',
      },
      {
        icon: 'users',
        title: 'Practical preflight',
        description: 'Catch obvious scale, orientation, completeness and topology problems before handoff.',
      },
      {
        icon: 'monitorSmartphone',
        title: 'Clear next actions',
        description: 'Convert only when a new format is needed; request repair when the geometry itself is the problem.',
      },
    ],
    formatGuidanceHeading: 'What to inspect by file type',
    formatGuidanceIntro: 'Different file formats can describe the same shape in fundamentally different ways.',
    formatGuidance: [
      {
        title: 'STEP / BREP',
        label: 'Precise CAD topology',
        description: 'Check solids, shells, open edges, separate bodies and assembly structure.',
      },
      {
        title: 'IGES',
        label: 'Legacy surfaces and curves',
        description: 'Check gaps, failed trims, loose patches and unit interpretation.',
      },
      {
        title: 'STL / OBJ / PLY / OFF',
        label: 'Meshes and scan data',
        description: 'Check normals, holes, non-manifold edges, disconnected shells and polygon density.',
      },
      {
        title: '3DM',
        label: 'Mixed Rhino geometry',
        description:
          'Check NURBS, B-reps, curves and meshes; remember that layers and render data may not transfer to other formats.',
      },
    ],
    troubleHeading: 'Common viewer problems',
    troubleIntro:
      'Start with the source file. A viewer cannot display geometry that is corrupt, unsupported or absent from the export.',
    problems: [
      {
        title: 'The viewer is blank',
        description:
          'The file may be corrupt, empty, unsupported or contain geometry outside the visible extents. Confirm it opens in the authoring tool and re-export.',
      },
      {
        title: 'The model is incomplete',
        description:
          'The export may omit components or use unsupported entities. Compare body/component counts and choose a broadly supported export option.',
      },
      {
        title: 'The model looks broken',
        description:
          'Mesh normals, open edges, missing faces or IGES trim gaps can cause visual defects. Repair the source rather than repeatedly converting it.',
      },
      {
        title: 'The model is the wrong size',
        description:
          'Unit conventions differ by format. Measure a known feature and set the intended unit in the target application.',
      },
      {
        title: 'A large file is slow',
        description:
          'High polygon counts, many surface patches or large assemblies increase parsing and rendering time. Export a simplified configuration when possible.',
      },
    ],
    privacyHeading: 'Privacy and file handling',
    privacyIntro:
      'Files are processed privately, excluded from the public CAD library and automatically deleted within 7 days. You retain ownership.',
    privacyPolicyHref: '/privacy-policy',
    privacyPolicyLabel: 'Privacy Policy',
    audienceHeading: 'Who the online CAD viewer is for',
    audience: [
      'Mechanical engineers reviewing supplier files',
      'Manufacturing teams checking files before quoting',
      'Design teams validating conversions',
      'Students opening files without expensive software',
      '3D-printing users inspecting meshes',
    ],
    designHubHeading: 'Find an existing model before starting from scratch',
    designHubIntro:
      'Search the Marathon OS library for a potential starting point. Review dimensions, licensing and production suitability before use.',
    designHubCta: 'Browse CAD models',
    faqHeading: 'Frequently asked questions about the 3D CAD viewer',
    faqIntro: 'Answers about supported formats, viewing limits, conversion, file size and privacy.',
    faqs: [
      {
        question: 'What is a CAD viewer?',
        answer:
          'A CAD viewer opens supported model files for visual inspection without the original authoring application. This viewer does not edit or repair the geometry.',
      },
      {
        question: 'Which formats are supported?',
        answer: 'STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP/BRP and 3DM are supported on this 3D viewer page.',
      },
      {
        question: 'Can I open STEP and IGES online?',
        answer: 'Yes. Use the dedicated STEP viewer for solids and assemblies or the IGES viewer for legacy curves and surfaces.',
        links: [
          { label: 'STEP viewer', href: '/tools/step-file-viewer' },
          { label: 'IGES viewer', href: '/tools/iges-file-viewer' },
        ],
        ctas: [
          { label: 'Open STEP viewer', href: '/tools/step-file-viewer' },
          { label: 'Open IGES viewer', href: '/tools/iges-file-viewer' },
        ],
      },
      {
        question: 'Can the viewer edit or repair my file?',
        answer:
          'No. Use CAD software or design support for editing, mesh repair, surface healing, tolerances or a native model rebuild.',
        cta: 'Hire a CAD designer',
        ctaHref: '/cad-services',
      },
      {
        question: 'Can I convert the file?',
        answer:
          'Yes. Open the CAD converter and choose an output supported for the detected input. Verify the result in the target workflow.',
        cta: 'Open CAD converter',
        ctaHref: '/tools/3d-cad-file-converter',
      },
      {
        question: 'What is the maximum file size?',
        answer: 'You can upload one supported file up to 300 MB. Complexity can still affect loading and rendering time.',
      },
      {
        question: 'How are uploaded files handled?',
        answer:
          'Files are processed privately, are not published to the CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    finalHeading: 'Open your CAD file online',
    finalBody:
      'Upload a supported STEP, IGES, STL, OBJ, PLY, OFF, BREP or 3DM file to inspect it before conversion, quoting or handoff.',
    finalCta: 'Upload CAD file',
    finalCtaHref: '#cad-file-viewer',
    finalSecondaryCta: 'Open converter',
    finalSecondaryHref: '/tools/3d-cad-file-converter',
  },
}

export const VIEWER_HUB_KEY = '3d-cad-viewer'

export function getUniqueViewerPage(cadType, options = {}) {
  const key = String(cadType || '').toLowerCase()
  if (key && UNIQUE_VIEWER_PAGES[key]) return UNIQUE_VIEWER_PAGES[key]
  if (options.isHub) return UNIQUE_VIEWER_PAGES[VIEWER_HUB_KEY] || null
  return null
}
