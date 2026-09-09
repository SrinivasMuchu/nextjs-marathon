/**
 * Approved copy from step-stl-report.xlsx for /tools/convert-stl-to-step only.
 */

export const UNIQUE_PAIR_PAGES = {
  'stl-to-step': {
    meta: {
      title: 'Convert STL to STEP Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert STL files to STEP online for mechanical CAD workflows. Secure uploads, files up to 300 MB, free downloads under 5 MB, and no software required.',
    },
    h1: 'Convert STL to STEP online',
    heroIntro:
      'Convert an STL (.stl) mesh to a STEP (.step or .stp) file for CAD import, supplier handoff and manufacturing review. Marathon OS preserves the visible mesh geometry in a STEP-compatible representation, but it does not recreate the original sketches, dimensions, constraints or feature history.',
    badges: ['Free under 5 MB', 'STL → STEP', 'No software installation'],
    uploadHeading: 'Upload your STL file',
    uploadHelper: 'Choose one STL file. This page is already configured to create a STEP or STP output.',
    dropzoneHead: 'Drag and drop your STL file here',
    convertCta: 'Convert STL to STEP',
    samplePrompt: 'No STL file available? Try a sample mesh to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Run the conversion in your browser workflow without installing a CAD application or plugin.',
      },
      {
        title: 'Honest mesh-to-CAD output',
        description: 'The STEP result is derived from the triangles in the STL. It is not presented as a recovered parametric model.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the converted file in a compatible STEP viewer or CAD application to check scale, faces and body status.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesHeading: 'Inspect the mesh, verify the result or request a native rebuild',
    resourcesIntro:
      'Use the STL viewer before conversion, the STEP viewer after conversion, or a CAD designer when the job requires editable features rather than a format change.',
    resources: [
      {
        title: 'Check the source STL',
        description: 'Find open edges, inverted normals, scale problems and disconnected shells before conversion.',
        href: '/tools/stl-file-viewer',
        cta: 'Open STL viewer',
      },
      {
        title: 'Inspect the STEP output',
        description: 'Confirm that the result opens, has the expected size and contains the expected surfaces or body.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Need a parametric model?',
        description: 'Ask a CAD designer to rebuild sketches, dimensions, constraints and manufacturing features from the mesh.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert STL to STEP online',
    workflowIntro: 'Move from a triangle mesh to a STEP-compatible result in three steps.',
    workflowSteps: [
      ['Upload the STL mesh', 'Choose a .stl file up to 300 MB. A watertight, consistently oriented mesh has the best chance of producing a usable result.'],
      ['Convert to STEP', 'The route is preconfigured for STEP output. Start the conversion without searching through a list of destination formats.'],
      ['Download and verify', 'Open the .step or .stp result in the application used for the next workflow. Check units, geometry, open edges and whether the result is a surface or solid body.'],
    ],
    workflowCta: 'Convert STL to STEP',
    behaviorHeading: 'What actually happens when STL is converted to STEP?',
    behaviorSummary:
      'STL stores a model as triangles. STEP can represent boundary-representation geometry, surfaces, solids, assemblies and product data. During conversion, the STL triangles are translated or wrapped into a STEP-compatible representation. Depending on the mesh and conversion engine, the result may be faceted surfaces, a sewn shell or a solid body. The process cannot infer the original design intent or native feature tree.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not recreated or may be lost',
    retained: [
      'Visible external shape defined by the mesh',
      'Vertex and face geometry',
      'Model orientation',
      'Separate connected shells where supported',
      'Closed volume when the source is watertight and the conversion succeeds',
    ],
    changed: [
      'Original sketches, dimensions and constraints',
      'Parametric features such as holes, fillets and extrusions',
      'Exact cylinders, planes and other analytic surfaces',
      'STL unit intent when it was not recorded elsewhere',
      'Color, materials, textures and manufacturing metadata',
    ],
    comparisonHeading: 'STL versus STEP',
    comparisonIntro: 'Choose the file according to what the next application needs—not because one format is universally better.',
    comparisonRows: [
      ['Data model', 'Triangular surface mesh', 'Boundary-representation geometry, surfaces, solids and product structure'],
      ['Editability', 'Mesh editing; no feature history', 'Can be used in CAD workflows, but a mesh-derived STEP is not automatically parametric'],
      ['Units', 'No standard unit field', 'Supports explicit unit information'],
      ['Best use', 'Slicing, 3D printing and mesh workflows', 'CAD exchange, supplier handoff, inspection and downstream engineering tools'],
      ['File extensions', '.stl', '.step, .stp'],
    ],
    chooseToHeading: 'Choose STEP when',
    chooseTo: [
      'A supplier or CAD application specifically requires .step or .stp',
      'You need a CAD-exchange container rather than a slicer-ready mesh',
      'You need to inspect the mesh-derived result in a STEP-compatible tool',
      'You understand that native features will not be restored',
    ],
    keepFromHeading: 'Keep STL when',
    keepFrom: [
      'The next step is slicing or 3D printing',
      'You are still repairing, decimating or editing the mesh',
      'You need to preserve the original triangle structure',
      'A STEP-compatible output provides no practical advantage for the next tool',
    ],
    checksHeading: 'Check the converted STEP before using it',
    checksIntro:
      'A successful download only confirms that a file was produced. Verify the engineering result before quoting, manufacturing or modifying the model.',
    checks: [
      ['Verify units and dimensions', 'STL has no standard unit field. Confirm whether the source was intended as millimetres, inches or another scale, then measure a known feature in the STEP result.'],
      ['Confirm body status', 'Check whether the receiving application reports a solid, closed shell, open shell or collection of surfaces.'],
      ['Inspect edges and faces', 'Look for missing triangles, gaps, self-intersections, sliver faces and non-manifold areas inherited from the STL.'],
      ['Review surface orientation', 'Confirm that face normals and shell orientation display correctly in the receiving application.'],
      ['Check model complexity', 'A very dense STL may create a large, slow STEP file with thousands of small faces. Confirm that it remains usable in the target application.'],
      ['Open it in the target workflow', 'Test the converted file in the exact CAD, CAM, viewer or supplier workflow for which it was created.'],
    ],
    troubleHeading: 'STL-to-STEP troubleshooting',
    troubleIntro:
      'Most failures are caused by invalid source meshes, missing unit context or expectations that format conversion will reconstruct a native CAD model.',
    problems: [
      {
        title: 'The STEP file looks faceted',
        description: 'Cause: The source consists of triangles, so the converted STEP may retain a face for each triangle.',
        fix: 'Reduce unnecessary mesh density before conversion, or request a native reverse-engineered model when smooth analytic surfaces are required.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: STL does not define a standard unit.',
        fix: 'Confirm the intended source unit and apply the correct scale in the receiving application.',
      },
      {
        title: 'The result is an open shell, not a solid',
        description: 'Cause: The STL may contain holes, non-manifold edges, self-intersections or disconnected shells.',
        fix: 'Repair and close the mesh, then convert it again.',
      },
      {
        title: 'Faces are missing or reversed',
        description: 'Cause: Inconsistent normals or invalid triangles can survive the conversion.',
        fix: 'Recalculate normals and repair the affected faces in a mesh editor before retrying.',
      },
      {
        title: 'The STEP file is too large or slow',
        description: 'Cause: A high triangle count can produce thousands of B-rep faces.',
        fix: 'Create a copy of the STL and decimate only non-critical detail before conversion.',
      },
      {
        title: 'The file opens but is difficult to modify',
        description: 'Cause: Changing the container does not recreate editable sketches and features.',
        fix: 'Use the STEP for exchange or inspection. Request a native CAD rebuild for design changes.',
        href: '/cad-services',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry. Marathon OS keeps conversion uploads separate from the public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related STL and STEP tools',
    relatedIntro: 'Use only the tools that support this exact workflow.',
    relatedTools: [
      { title: 'Open STL viewer', description: 'Inspect the source mesh', href: '/tools/stl-file-viewer', from: 'STL', viewer: true },
      { title: 'Open STEP viewer', description: 'Verify the converted result', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'STEP to STL', description: 'Create a print-ready mesh', href: '/tools/convert-step-to-stl', from: 'STEP', to: 'STL' },
      { title: 'STL to IGES', description: 'Create a legacy CAD-exchange file', href: '/tools/convert-stl-to-iges', from: 'STL', to: 'IGES' },
      { title: 'STL to BREP', description: 'Try an alternative boundary-representation workflow', href: '/tools/convert-stl-to-brep', from: 'STL', to: 'BREP' },
      { title: 'Hire a CAD designer', description: 'Rebuild a native editable model', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of related CAD and mesh handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to 3D-printing mesh' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
      { label: 'DXF to DWG', path: '/dxf-to-dwg', oneLiner: 'Native drawing workflow' },
    ],
    designHubHeading: 'Find an existing CAD model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using any downloaded file.',
    faqHeading: 'Frequently asked questions about STL to STEP conversion',
    faqIntro: 'Clear answers about output quality, editability, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert STL to STEP online?',
        answer: 'Upload the .stl file, confirm STEP as the preselected output, start the conversion and download the resulting .step or .stp file. Open the result in the application used for the next workflow and verify its scale and geometry.',
      },
      {
        question: 'Does converting STL to STEP create an editable parametric model?',
        answer: 'No. The STEP result is based on the triangles in the STL. It does not recreate the original sketches, constraints, dimensions or feature tree. A CAD designer must rebuild those features when a clean native model is required.',
      },
      {
        question: 'Will the converted STEP be a solid?',
        answer: 'It depends on the quality and topology of the source mesh and the conversion result. A watertight, manifold STL may produce a closed shell or solid, while a damaged or open mesh may remain surfaces. Always check the body status after conversion.',
      },
      {
        question: 'Why is the converted model the wrong size?',
        answer: 'STL does not define a standard unit. The source may have been authored in millimetres, inches or another scale. Measure a known feature and apply the intended unit in the receiving application.',
      },
      {
        question: 'Is the STL to STEP converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum STL file size?',
        answer: 'You can upload an STL file up to 300 MB. Very dense meshes may still create large STEP outputs and take longer to process or open.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a truly editable CAD model?',
    designerBody:
      'File conversion changes the format. It does not recover design intent. Work with a vetted CAD designer when you need clean sketches, dimensions, tolerances, features or a production-ready native model.',
    designerSecondary: 'Convert another STL file',
  },
}

export function getUniquePairPage(conversionParams) {
  const key = String(conversionParams || '')
    .toLowerCase()
    .split('/')
    .filter(Boolean)
    .pop()
  return UNIQUE_PAIR_PAGES[key] || null
}
