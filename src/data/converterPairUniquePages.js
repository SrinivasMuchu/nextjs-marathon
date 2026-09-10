/**
 * Approved unique copy from step-stl-report.xlsx for dedicated converter pair pages.
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
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
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
  'stl-to-iges': {
    meta: {
      title: 'Convert STL to IGES Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert STL meshes to IGES online for legacy CAD and CAM workflows. Secure uploads up to 300 MB, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert STL to IGES online',
    heroIntro:
      'Convert an STL (.stl) mesh to IGES (.iges or .igs) for legacy CAD/CAM import and surface-based exchange. The IGES result is derived from the STL triangles; it does not recreate smooth NURBS surfaces, sketches, dimensions, constraints or the original feature history.',
    badges: ['Free under 5 MB', 'STL → IGES', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your STL file',
    uploadHelper: 'Choose one STL file. This page is already configured to create IGES output.',
    dropzoneHead: 'Drag and drop your STL mesh here',
    convertCta: 'Convert STL to IGES',
    samplePrompt: 'No STL file available? Try a STL sample to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the STL-to-IGES workflow in your browser without installing a CAD application or conversion plugin.',
      },
      {
        title: 'Honest mesh-to-surface output',
        description: 'The IGES result represents geometry derived from the STL facets. It is not presented as a recovered analytic or parametric CAD model.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the IGES result in the legacy CAD, CAM or surface-modelling application used downstream. Check scale, surface continuity, open edges and file complexity.',
        href: '/tools/igs-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your workflow',
    resourcesHeading: 'Inspect the STL, verify the IGES or request specialist help',
    resourcesIntro:
      'Inspect the source mesh first, validate the IGES result after conversion, or request reverse engineering when the job requires clean analytic surfaces.',
    resources: [
      {
        title: 'Check the source STL',
        description: 'Check the STL for holes, inverted normals, disconnected shells, excessive triangle density and incorrect scale before conversion.',
        href: '/tools/stl-file-viewer',
        cta: 'Open STL viewer',
      },
      {
        title: 'Inspect the IGES output',
        description: 'Confirm that the IGES opens at the expected size and contains the expected surfaces, shells or entities.',
        href: '/tools/igs-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Need smooth CAD surfaces?',
        description: 'Ask a CAD designer to rebuild analytic planes, cylinders, fillets and NURBS surfaces when a faceted IGES result is not suitable.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert STL to IGES online',
    workflowIntro: 'Move from a triangular STL mesh to an IGES-compatible surface model in three steps.',
    workflowSteps: [
      ['Upload the STL file', 'Choose a .stl file up to 300 MB. Watertight, manifold meshes with consistent normals produce the most reliable exchange result.'],
      ['Convert to IGES', 'The route is preconfigured for IGES output. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .iges or .igs file in the receiving system. Verify intended units, surface count, gaps and whether the geometry is usable for the next operation.'],
    ],
    workflowCta: 'Convert STL to IGES',
    behaviorHeading: 'What actually happens when STL is converted to IGES?',
    behaviorSummary:
      'STL stores only a tessellated surface made of triangles. IGES can store curves, wireframes and trimmed surface entities. During conversion, the mesh facets are translated into IGES-compatible geometry—often many planar or trimmed surface patches. The process cannot infer the original smooth surfaces or design intent.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Visible shape defined by the STL triangles',
      'Mesh vertices and face boundaries',
      'Model orientation',
      'Separate connected shells where supported',
      'Closed volume only when the source is watertight and the converted surfaces sew successfully',
    ],
    changed: [
      'Original sketches, constraints and feature history',
      'Exact cylinders, planes and other analytic surfaces',
      'STL unit intent when it was not recorded elsewhere',
      'Color, materials and textures',
      'A lightweight solid model; dense meshes can create thousands of IGES entities',
    ],
    comparisonHeading: 'STL versus IGES',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Primary use', 'Slicing, 3D printing and mesh workflows', 'Legacy CAD/CAM exchange and surface-based workflows'],
      ['Geometry', 'Triangle mesh', 'Curves, wireframes and trimmed surface entities'],
      ['Editability', 'Mesh editing; no feature history', 'Surface/entity editing, but a mesh-derived IGES remains faceted'],
      ['Units', 'No standard unit field', 'Can carry a unit setting, but the source intent must be supplied correctly'],
      ['Visual data', 'Standard STL does not carry textures or materials', 'Not intended for texture-rich visualization workflows'],
    ],
    chooseToHeading: 'Choose IGES when',
    chooseTo: [
      'A legacy CAD, CAM or supplier workflow specifically requires .igs or .iges',
      'You need an IGES-compatible container for the existing mesh-derived shape',
      'You will validate the result as surfaces rather than assume it is a native solid',
      'A faceted surface result is acceptable for the receiving workflow',
    ],
    keepFromHeading: 'Keep STL when',
    keepFrom: [
      'The next step is slicing or 3D printing',
      'You are still repairing or simplifying the mesh',
      'You need to preserve the original triangles',
      'The receiving system already accepts STL',
    ],
    checksHeading: 'Check the converted IGES before using it',
    checksIntro:
      'A valid IGES download can still contain thousands of faceted surfaces or open boundaries. Inspect it before machining, quoting or editing.',
    checks: [
      ['Verify units and overall dimensions', 'STL has no standard unit field. Measure a known feature and confirm the intended millimetre, inch or other scale in the IGES result.'],
      ['Check the surface or shell status', 'Determine whether the receiving application reports separate surfaces, a sewn shell or a closed body.'],
      ['Inspect open edges and gaps', 'Look for holes, overlaps, non-manifold areas and unsewn boundaries inherited from the mesh.'],
      ['Review facet density', 'A dense STL can become a very large IGES with thousands of small surface entities. Confirm the file remains usable.'],
      ['Confirm orientation and normals', 'Check for flipped or missing surface patches after import.'],
      ['Test the target CAD/CAM workflow', 'Open the IGES in the exact legacy CAD, CAM or supplier system for which it was created.'],
    ],
    troubleHeading: 'STL-to-IGES troubleshooting',
    troubleIntro:
      'Most failures come from damaged meshes, missing unit context or expecting automatic surface reconstruction from triangles.',
    problems: [
      {
        title: 'The IGES looks faceted',
        description: 'Cause: The output follows the triangles in the STL.',
        fix: 'Use the file for compatible exchange, or request a reverse-engineered model when smooth analytic surfaces are required.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: STL does not define a standard unit.',
        fix: 'Confirm the intended source unit and rescale in the receiving application.',
      },
      {
        title: 'The result contains open surfaces',
        description: 'Cause: The STL has holes, non-manifold edges or disconnected shells.',
        fix: 'Repair and close the mesh before converting again.',
      },
      {
        title: 'The IGES is huge or slow',
        description: 'Cause: Each source triangle may generate additional IGES entities.',
        fix: 'Create a copy and reduce non-critical mesh density before conversion.',
      },
      {
        title: 'Faces are missing or reversed',
        description: 'Cause: Invalid triangles or inconsistent normals were inherited from the STL.',
        fix: 'Repair faces and recalculate normals in a mesh editor.',
      },
      {
        title: 'The file is difficult to edit',
        description: 'Cause: Changing the container does not reconstruct native CAD features.',
        fix: 'Use the result for exchange or inspection; commission a native rebuild for design changes.',
        href: '/cad-services',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related STL and IGES tools',
    relatedIntro: 'Use tools that support the same STL-to-IGES workflow.',
    relatedTools: [
      { title: 'Open STL viewer', description: 'Inspect the source mesh', href: '/tools/stl-file-viewer', from: 'STL', viewer: true },
      { title: 'Open IGES viewer', description: 'Verify the converted surfaces', href: '/tools/igs-file-viewer', from: 'IGES', viewer: true },
      { title: 'IGES to STL', description: 'Return a legacy surface model to a mesh workflow', href: '/tools/convert-iges-to-stl', from: 'IGES', to: 'STL' },
      { title: 'STL to STEP', description: 'Try a STEP-compatible CAD exchange route', href: '/tools/convert-stl-to-step', from: 'STL', to: 'STEP' },
      { title: 'STL to BREP', description: 'Try a boundary-representation workflow', href: '/tools/convert-stl-to-brep', from: 'STL', to: 'BREP' },
      { title: 'Hire a CAD designer', description: 'Rebuild clean analytic geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of adjacent engineering, mesh and drawing handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to 3D-printing mesh' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Mesh to CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using a downloaded file.',
    faqHeading: 'Frequently asked questions about STL to IGES conversion',
    faqIntro: 'Clear answers about output behaviour, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert STL to IGES online?',
        answer: 'Upload the STL file (.stl), confirm IGES as the preselected output, start the conversion and download the IGES result (.iges, .igs). Verify it in the application used for the next workflow.',
      },
      {
        question: 'Why convert STL to IGES?',
        answer: 'Use this conversion when an older CAD, CAM or supplier system requires IGES and does not accept the original STL directly. The result remains based on the mesh geometry.',
      },
      {
        question: 'Will STL to IGES create smooth editable CAD surfaces?',
        answer: 'Not automatically. The IGES is derived from the STL triangles and may contain many faceted surface patches. Smooth NURBS or analytic surfaces require reverse engineering or a native rebuild.',
      },
      {
        question: 'Which STL and IGES extensions are supported?',
        answer: 'This route accepts .stl input and creates .iges, .igs output.',
      },
      {
        question: 'Is the STL to IGES converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum STL file size?',
        answer: 'You can upload a STL file up to 300 MB. High triangle counts can create much larger IGES files with many individual entities.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a clean surface model instead of a faceted conversion?',
    designerBody:
      'Format conversion can package the mesh as IGES, but it cannot recover the original smooth design. Work with a CAD designer for accurate NURBS surfaces, dimensions, tolerances or production-ready native geometry.',
    designerSecondary: 'Convert another STL file',
  },
  'stl-to-brep': {
    meta: {
      title: 'Convert STL to BREP Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert STL mesh files to BREP online for Open CASCADE and topology workflows. Secure uploads up to 300 MB, free under 5 MB and no software required.',
    },
    h1: 'Convert STL to BREP online',
    heroIntro:
      'Convert an STL (.stl) triangle mesh to BREP (.brep or .brp) for Open CASCADE and topology-based CAD workflows. The result can carry faces, edges and vertices derived from the mesh, but it does not recover smooth analytic surfaces, sketches or feature history.',
    badges: ['Free under 5 MB', 'STL → BREP', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your STL file',
    uploadHelper: 'Choose one STL file. This page is already configured to create BREP output.',
    dropzoneHead: 'Drag and drop your STL file here',
    convertCta: 'Convert STL to BREP',
    samplePrompt: 'No STL file available? Try a STL sample to see the workflow.',
    sampleCta: 'Try sample.stl',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the STL-to-BREP workflow in your browser without installing a CAD application or plugin.',
      },
      {
        title: 'Mesh-derived boundary representation',
        description:
          'The BREP output reflects the STL facets. A watertight mesh may form a closed shell or solid; damaged meshes may remain open or invalid.',
      },
      {
        title: 'Ready to inspect',
        description:
          'Open the BREP result in an Open CASCADE-compatible viewer or CAD system and check body status, face count, scale and open edges.',
        href: '/tools/brep-file-viewer',
        cta: 'Open BREP viewer',
      },
      {
        title: 'Private file handling',
        description: 'Files stay private, are never added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your CAD workflow',
    resourcesHeading: 'Inspect the STL, verify the BREP or request specialist help',
    resourcesIntro:
      'Inspect the STL before conversion, validate the BREP topology afterward, or request a native rebuild when smooth editable geometry matters.',
    resources: [
      {
        title: 'Check the source STL',
        description: 'Check watertightness, normals, disconnected shells, non-manifold edges and triangle density before conversion.',
        href: '/tools/stl-file-viewer',
        cta: 'Open STL viewer',
      },
      {
        title: 'Inspect the BREP output',
        description: 'Confirm whether the result is a solid, closed shell, open shell or collection of faceted faces.',
        href: '/tools/brep-file-viewer',
        cta: 'Open BREP viewer',
      },
      {
        title: 'Need editable manufacturing geometry?',
        description: 'Ask a CAD designer to rebuild clean analytic faces and features instead of editing thousands of mesh-derived BREP faces.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert STL to BREP online',
    workflowIntro: 'Move from a triangular STL mesh to a BREP topology file in three steps.',
    workflowSteps: [
      ['Upload the STL file', 'Choose a .stl file up to 300 MB. Watertight, manifold meshes with consistent normals produce the most reliable topology.'],
      ['Convert to BREP', 'The route is preconfigured for BREP. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .brep or .brp result in the target CAD kernel. Verify units, body validity, open edges and face count.'],
    ],
    workflowCta: 'Convert STL to BREP',
    behaviorHeading: 'What actually happens when STL is converted to BREP?',
    behaviorSummary:
      'STL stores an unstructured triangle surface. BREP represents geometry through connected faces, edges and vertices. Conversion creates BREP topology from the STL facets; it may sew a clean watertight mesh into a closed shell or solid, but it does not infer cylinders, fillets, holes or the original feature tree.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Visible shape defined by triangles',
      'Vertex and face boundaries',
      'Model orientation',
      'Separate shells where supported',
      'Closed volume when a valid watertight mesh sews successfully',
    ],
    changed: [
      'Original sketches, dimensions and constraints',
      'Parametric features and design history',
      'Exact planes, cylinders, cones and NURBS surfaces',
      'STL unit intent unless supplied separately',
      'Materials, colors and manufacturing metadata',
    ],
    comparisonHeading: 'STL versus BREP',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Data model', 'Triangle surface mesh', 'Connected faces, edges and vertices'],
      ['Body status', 'May be watertight but has no CAD solid topology', 'Can represent shells or solids when topology is valid'],
      ['Units', 'No standard unit field', 'Application/kernel dependent; verify dimensions'],
      ['Editability', 'Mesh editing', 'Topology editing, often with one face per triangle'],
      ['Best use', '3D printing and mesh workflows', 'Open CASCADE and B-rep CAD workflows'],
    ],
    chooseToHeading: 'Choose BREP when',
    chooseTo: [
      'An Open CASCADE workflow specifically needs BREP',
      'You need faces, edges and topology rather than raw triangles',
      'The mesh is clean enough to sew into usable topology',
      'You accept that the model may remain faceted',
    ],
    keepFromHeading: 'Keep STL when',
    keepFrom: [
      'The next step is slicing or 3D printing',
      'You are still repairing or simplifying the mesh',
      'A lightweight triangle file is preferred',
      'You need to preserve the original tessellation exactly',
    ],
    checksHeading: 'Check the converted BREP before using it',
    checksIntro:
      'A BREP file can be created successfully and still contain open shells or thousands of unusable faces. Validate topology before downstream use.',
    checks: [
      ['Verify scale and intended units', 'STL has no standard unit field; measure a known feature after import.'],
      ['Confirm body status', 'Check whether the result is a valid solid, closed shell, open shell or compound.'],
      ['Inspect open and non-manifold edges', 'Look for holes, T-junctions, overlaps and self-intersections inherited from the mesh.'],
      ['Review face count', 'A face-per-triangle result may be too heavy for editing or Boolean operations.'],
      ['Check orientation', 'Confirm shell and face orientation and recalculate source normals if needed.'],
      ['Run the target operation', 'Test the Boolean, healing or CAD operation that motivated the conversion.'],
    ],
    troubleHeading: 'STL-to-BREP troubleshooting',
    troubleIntro:
      'Failures usually trace back to non-manifold STL geometry, missing unit context, invalid normals or excessive triangle density.',
    problems: [
      {
        title: 'The BREP is an open shell',
        description: 'Cause: The STL contains holes or edges that do not sew.',
        fix: 'Repair and close the mesh before converting again.',
      },
      {
        title: 'The result has thousands of faces',
        description: 'Cause: Each triangle was represented as a separate BREP face.',
        fix: 'Decimate non-critical mesh detail or commission a native rebuild.',
      },
      {
        title: 'Boolean operations fail',
        description: 'Cause: The converted topology is invalid, self-intersecting or too fragmented.',
        fix: 'Run mesh repair, then validate and heal the BREP in the target kernel.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: The STL did not declare a physical unit.',
        fix: 'Apply the intended millimetre, inch or other scale after measuring a known feature.',
      },
      {
        title: 'Faces are reversed or missing',
        description: 'Cause: Source normals or triangles are inconsistent.',
        fix: 'Repair invalid facets and recalculate normals before retrying.',
      },
      {
        title: 'The file opens but is hard to edit',
        description: 'Cause: BREP topology does not equal recovered parametric features.',
        fix: 'Use the file for exchange; request a native rebuild for design changes.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related STL and BREP tools',
    relatedIntro: 'Use tools that support the same STL-to-BREP workflow.',
    relatedTools: [
      { title: 'STL file viewer', description: 'inspect the source mesh', href: '/tools/stl-file-viewer', from: 'STL', viewer: true },
      { title: 'BREP file viewer', description: 'check the converted topology', href: '/tools/brep-file-viewer', from: 'BREP', viewer: true },
      { title: 'STL to STEP', description: 'create a STEP-compatible result', href: '/tools/convert-stl-to-step', from: 'STL', to: 'STEP' },
      { title: 'BREP to STL', description: 'return to a printable mesh', href: '/tools/convert-brep-to-stl', from: 'BREP', to: 'STL' },
      { title: 'OBJ to BREP', description: 'convert another mesh format', href: '/tools/convert-obj-to-brep', from: 'OBJ', to: 'BREP' },
      { title: 'Hire a CAD designer', description: 'rebuild clean native geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore adjacent engineering and mesh handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to printable mesh' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'legacy surface exchange' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'legacy surfaces to STEP' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro:
      'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using it.',
    faqHeading: 'Frequently asked questions about STL to BREP conversion',
    faqIntro: 'Clear answers about output behavior, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert STL to BREP online?',
        answer:
          'Upload STL (.stl), confirm BREP as the preselected output, convert and download BREP (.brep, .brp). Verify the result in the target application.',
      },
      {
        question: 'Why convert STL to BREP?',
        answer:
          'Use BREP when an Open CASCADE or topology-based CAD workflow requires connected faces, edges and vertices rather than a raw triangle mesh.',
      },
      {
        question: 'Will STL to BREP create a smooth, editable solid?',
        answer:
          'Not automatically. A clean STL may become a valid closed BREP, but the faces are still derived from triangles and no original parametric features are recovered.',
      },
      {
        question: 'Which STL and BREP extensions are supported?',
        answer: 'This route accepts .stl input and creates .brep, .brp output.',
      },
      {
        question: 'Is the STL to BREP converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum STL file size?',
        answer:
          'You can upload a STL file up to 300 MB. Very dense meshes can create enormous BREP face counts and slow or fail downstream operations.',
      },
      {
        question: 'How are my files handled?',
        answer:
          'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    designerTitle: 'Need more than a faceted BREP?',
    designerBody:
      'A file-format change does not reverse-engineer the original part. Work with a CAD designer when you need analytic surfaces, tolerances, features or a production-ready native model.',
    designerSecondary: 'Convert another STL file',
  },
  'step-to-iges': {
    meta: {
      title: 'Convert STEP to IGES Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert STEP or STP files to IGES online for legacy CAD and CAM compatibility. Secure 300 MB uploads, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert STEP to IGES online',
    heroIntro:
      'Convert a STEP or STP (.step, .stp) model to IGES (.iges or .igs) for legacy CAD/CAM systems and suppliers that still require surface-based exchange. Compatible curves and surfaces can transfer, but assemblies, solid-body status, names, colors and product metadata may change.',
    badges: ['Free under 5 MB', 'STEP → IGES', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your STEP file',
    uploadHelper: 'Choose one STEP file. This page is already configured to create IGES output.',
    dropzoneHead: 'Drag and drop your STEP CAD file here',
    convertCta: 'Convert STEP to IGES',
    samplePrompt: 'No STEP file available? Try a STEP sample to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the STEP-to-IGES workflow in your browser without installing a CAD application or conversion plugin.',
      },
      {
        title: 'Built for legacy compatibility',
        description: 'Move compatible STEP geometry into an IGES workflow while keeping the original STEP file as the source of truth.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the IGES in the receiving legacy CAD or CAM tool and confirm surfaces, trims, body status, units and assembly structure before production use.',
        href: '/tools/igs-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your workflow',
    resourcesHeading: 'Inspect the STEP, verify the IGES or request specialist help',
    resourcesIntro:
      'Inspect the STEP source, verify the translated IGES surfaces and escalate when gaps or lost product structure require specialist repair.',
    resources: [
      {
        title: 'Check the source STEP',
        description: 'Confirm that the source STEP opens correctly and contains the expected solids, surfaces and product structure.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Inspect the IGES output',
        description: 'Check whether the IGES imports as closed bodies, open shells or separate surfaces and whether all trimmed boundaries remain intact.',
        href: '/tools/igs-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Need healed or rebuilt geometry?',
        description: 'Ask a CAD designer to stitch surfaces, repair gaps, rebuild lost features or deliver a native file for the receiving application.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert STEP to IGES online',
    workflowIntro: 'Move from a STEP solid or surface model to an IGES surface-exchange file in three steps.',
    workflowSteps: [
      ['Upload the STEP file', 'Choose a .step or .stp file up to 300 MB. Confirm that it opens correctly before converting.'],
      ['Convert to IGES', 'The route is preconfigured for IGES output. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .iges or .igs result in the target system and compare it with the STEP source for dimensions, surfaces, topology and structure.'],
    ],
    workflowCta: 'Convert STEP to IGES',
    behaviorHeading: 'What actually happens when STEP is converted to IGES?',
    behaviorSummary:
      'STEP can carry B-rep solids, surfaces, assemblies and product information. IGES is commonly used for curves and trimmed-surface exchange. Conversion maps compatible geometry into IGES entities, but receiving applications may import a STEP solid as separate surfaces or an open shell. Assembly hierarchy and richer product metadata may be reduced or omitted.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Compatible curves and surface geometry',
      'Overall dimensions and orientation',
      'Trimmed surface boundaries where supported',
      'Explicit units when translated correctly',
      'Separate components or layers only where both the converter and receiving tool support them',
    ],
    changed: [
      'Native feature history from the authoring CAD system',
      'Robust solid-body status when surfaces do not sew after import',
      'Assembly hierarchy, constraints and product structure',
      'Names, colors, materials and application-specific attributes',
      'STEP product metadata without an IGES equivalent',
    ],
    comparisonHeading: 'STEP versus IGES',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Primary use', 'Modern neutral CAD exchange for manufacturing and product structure', 'Legacy curve and surface exchange'],
      ['Geometry', 'B-rep solids, surfaces and wireframes', 'Curves, wireframes and trimmed surfaces; solid handling varies by importer'],
      ['Structure', 'Can retain assemblies and product hierarchy', 'Often flatter entity or layer organisation'],
      ['Units', 'Supports explicit unit information', 'Supports a unit flag, but translation must be checked'],
      ['Metadata', 'Can carry names, colors and product data', 'More limited and inconsistently interpreted across applications'],
    ],
    chooseToHeading: 'Choose IGES when',
    chooseTo: [
      'A supplier or legacy application specifically requires IGES',
      'Surface and curve exchange is more important than assembly intelligence',
      'The receiving workflow has been tested with .igs or .iges',
      'You will compare the result against the original STEP',
    ],
    keepFromHeading: 'Keep STEP when',
    keepFrom: [
      'The receiving application already accepts STEP',
      'You need solid-body reliability or assembly structure',
      'Names, colors or product metadata matter',
      'The model will continue through a modern CAD/CAM workflow',
    ],
    checksHeading: 'Check the converted IGES before using it',
    checksIntro:
      'STEP-to-IGES is often a compatibility handoff, not an upgrade. Confirm that the receiving application interprets surfaces and structure correctly.',
    checks: [
      ['Compare dimensions and units', 'Measure known features in both files and confirm the same unit system after import.'],
      ['Confirm solid or surface status', 'Check whether each STEP solid remains closed or arrives as separate surfaces or an open shell.'],
      ['Inspect trims and open edges', 'Look for gaps, missing patches, duplicated surfaces and broken trim boundaries.'],
      ['Review assemblies and components', 'Confirm whether hierarchy was retained, flattened or separated into files, layers or entities.'],
      ['Check names, colors and layers', 'Verify any organisation or visual attributes needed by the receiving team.'],
      ['Test the exact legacy application', 'Import the IGES into the target CAD/CAM version and run the downstream operation before handoff.'],
    ],
    troubleHeading: 'STEP-to-IGES troubleshooting',
    troubleIntro:
      'Common issues come from different surface tolerances, limited IGES structure and application-specific import behaviour.',
    problems: [
      {
        title: 'The solid imports as separate surfaces',
        description: 'Cause: The IGES importer did not sew translated surfaces into a closed body.',
        fix: 'Adjust import healing tolerance or stitch the surfaces in CAD.',
      },
      {
        title: 'Gaps appear along trimmed edges',
        description: 'Cause: STEP and IGES represent trims and tolerances differently.',
        fix: 'Run geometry healing and compare the problem area with the source STEP.',
      },
      {
        title: 'The assembly is flattened',
        description: 'Cause: IGES product structure is more limited or inconsistently supported.',
        fix: 'Exchange parts separately or retain STEP when assembly relationships matter.',
      },
      {
        title: 'Names, colors or layers changed',
        description: 'Cause: Attributes did not have a reliable equivalent in the IGES workflow.',
        fix: 'Reapply critical organisation in the receiving tool and keep the STEP source.',
      },
      {
        title: 'The IGES is much larger',
        description: 'Cause: The model was expanded into many individual surface entities.',
        fix: 'Remove unnecessary geometry or exchange only the required components.',
      },
      {
        title: 'The legacy tool rejects the file',
        description: 'Cause: It does not support one or more exported IGES entity types.',
        fix: 'Review its supported IGES entities or ask for a supplier-tested export.',
        href: '/cad-services',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related STEP and IGES tools',
    relatedIntro: 'Use tools that support the same STEP-to-IGES workflow.',
    relatedTools: [
      { title: 'Open STEP viewer', description: 'Inspect the source geometry', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'Open IGES viewer', description: 'Check the converted surfaces', href: '/tools/igs-file-viewer', from: 'IGES', viewer: true },
      { title: 'IGES to STEP', description: 'Move legacy surfaces back to modern exchange', href: '/tools/convert-iges-to-step', from: 'IGES', to: 'STEP' },
      { title: 'STEP to STL', description: 'Create a 3D-printing mesh', href: '/tools/convert-step-to-stl', from: 'STEP', to: 'STL' },
      { title: 'STEP to 3DM', description: 'Prepare geometry for Rhino', href: '/tools/convert-step-to-3dm', from: 'STEP', to: '3DM' },
      { title: 'Hire a CAD designer', description: 'Repair or rebuild failed geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of adjacent engineering, mesh and drawing handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to 3D-printing mesh' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Mesh to CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using a downloaded file.',
    faqHeading: 'Frequently asked questions about STEP to IGES conversion',
    faqIntro: 'Clear answers about output behaviour, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert STEP to IGES online?',
        answer: 'Upload the STEP file (.step, .stp), confirm IGES as the preselected output, start the conversion and download the IGES result (.iges, .igs). Verify it in the application used for the next workflow.',
      },
      {
        question: 'Why convert STEP to IGES?',
        answer: 'Convert STEP to IGES when an older application, machine workflow or supplier specifically requires .igs or .iges and cannot reliably use STEP.',
      },
      {
        question: 'Will a STEP solid remain a solid in IGES?',
        answer: "Not always. The geometry may import as separate trimmed surfaces or an open shell depending on translation tolerances and the receiving application's IGES importer. Verify body status after conversion.",
      },
      {
        question: 'Which STEP and IGES extensions are supported?',
        answer: 'This route accepts .step, .stp input and creates .iges, .igs output.',
      },
      {
        question: 'Is the STEP to IGES converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum STEP file size?',
        answer: 'You can upload a STEP file up to 300 MB. Assemblies and complex surfaces can expand into many IGES entities and take longer to import.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a supplier-tested IGES export?',
    designerBody:
      'When the receiving system has strict entity, tolerance or version requirements, work with a CAD specialist who can heal the geometry, validate it in the target application and deliver a production-ready handoff.',
    designerSecondary: 'Convert another STEP file',
  },
  'obj-to-step': {
    meta: {
      title: 'Convert OBJ to STEP Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert OBJ meshes to STEP online for CAD import and engineering handoff. Secure uploads up to 300 MB, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert OBJ to STEP online',
    heroIntro:
      'Convert an OBJ (.obj) polygon mesh to STEP (.step or .stp) for CAD import, engineering review and supplier handoff. The result represents the OBJ geometry in a STEP-compatible form; it does not recreate parametric features, smooth analytic surfaces, materials, textures or the original design history.',
    badges: ['Free under 5 MB', 'OBJ → STEP', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your OBJ file',
    uploadHelper: 'Choose one OBJ file. This page is already configured to create STEP output.',
    dropzoneHead: 'Drag and drop your OBJ mesh here',
    convertCta: 'Convert OBJ to STEP',
    samplePrompt: 'No OBJ file available? Try a OBJ sample to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the OBJ-to-STEP workflow in your browser without installing a CAD application or conversion plugin.',
      },
      {
        title: 'Geometry-first conversion',
        description: 'Move the visible polygon shape into a STEP workflow without claiming that mesh data becomes a native parametric CAD model.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the STEP result in the target CAD application and check scale, surface or body status, face count and whether separate OBJ objects were retained.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your workflow',
    resourcesHeading: 'Inspect the OBJ, verify the STEP or request specialist help',
    resourcesIntro:
      'Inspect the OBJ and its companion assets, validate the STEP geometry and request a native rebuild when editable engineering features are required.',
    resources: [
      {
        title: 'Check the source OBJ',
        description: 'Check mesh integrity, orientation, object groups and overall scale. Keep the .mtl and texture files as the visual source of truth.',
        href: '/tools/obj-file-viewer',
        cta: 'Open OBJ viewer',
      },
      {
        title: 'Inspect the STEP output',
        description: 'Confirm that the STEP contains the expected shape and opens as surfaces, shells or bodies suitable for the next workflow.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Need a parametric CAD model?',
        description: 'Ask a CAD designer to rebuild sketches, dimensions, constraints and manufacturing features from the reference mesh.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert OBJ to STEP online',
    workflowIntro: 'Move from a polygonal OBJ mesh to a STEP-compatible CAD exchange file in three steps.',
    workflowSteps: [
      ['Upload the OBJ file', 'Choose one .obj file up to 300 MB. Use a closed, manifold mesh with consistent normals for the most reliable geometric result.'],
      ['Convert to STEP', 'The route is preconfigured for STEP output. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .step or .stp result in the receiving CAD tool. Verify units, face count, body status, separate parts and critical dimensions.'],
    ],
    workflowCta: 'Convert OBJ to STEP',
    behaviorHeading: 'What actually happens when OBJ is converted to STEP?',
    behaviorSummary:
      'OBJ stores polygon vertices, faces, normals, UV coordinates and optional object or group names; materials are usually referenced through a separate .mtl file and external textures. STEP is built for CAD exchange. Conversion translates the polygon geometry into a faceted STEP-compatible representation, but it cannot infer original sketches, features or smooth analytic surfaces.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Visible polygonal shape',
      'Vertex positions and face boundaries',
      'Model orientation',
      'Separate connected shells or objects where supported',
      'Closed volume only when the mesh is watertight and translated successfully',
    ],
    changed: [
      'Materials defined in a companion MTL file',
      'Texture images and UV mapping',
      'Smoothing groups and rendering-specific normals',
      'Original sketches, constraints and feature history',
      'OBJ unit intent when it was not documented',
    ],
    comparisonHeading: 'OBJ versus STEP',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Primary use', '3D assets, rendering and polygon modelling', 'Neutral CAD exchange and engineering handoff'],
      ['Geometry', 'Polygon mesh', 'B-rep or faceted geometry in a STEP container'],
      ['Visual data', 'Can reference MTL materials, textures and UVs', 'Not designed to carry OBJ texture packages'],
      ['Editability', 'Mesh and vertex editing', 'CAD operations may be possible, but no recovered parametric feature tree'],
      ['Units and structure', 'No universal unit convention; objects and groups supported', 'Explicit units and product structure are possible, but depend on conversion support'],
    ],
    chooseToHeading: 'Choose STEP when',
    chooseTo: [
      'A CAD application or supplier specifically requires STEP',
      'You need the visible mesh shape inside a CAD exchange workflow',
      'Materials and textures are not required in the destination',
      'A faceted, non-parametric result is acceptable',
    ],
    keepFromHeading: 'Keep OBJ when',
    keepFrom: [
      'The next step is rendering, animation or game-engine use',
      'Textures, UVs, materials or smoothing information matter',
      'You are still editing polygon topology',
      'The receiving tool already accepts OBJ',
    ],
    checksHeading: 'Check the converted STEP before using it',
    checksIntro:
      'A STEP file can open successfully while still being faceted, incorrectly scaled or missing visual and object data. Validate the engineering result.',
    checks: [
      ['Verify units and dimensions', 'OBJ has no universal unit convention. Measure a known feature and apply the intended scale in the STEP workflow.'],
      ['Confirm surfaces, shells or solids', 'Check how the target CAD application classifies the converted geometry.'],
      ['Inspect face count and performance', 'Dense OBJ meshes may create a heavy STEP with thousands of small faces.'],
      ['Compare separate objects and groups', 'Confirm whether OBJ objects, groups or connected shells remained separate where required.'],
      ['Check missing or reversed faces', 'Inspect normals, gaps, non-manifold edges and self-intersections inherited from the OBJ.'],
      ['Keep visual assets separately', 'Retain the original OBJ, MTL and texture files because STEP normally will not preserve the rendered appearance.'],
    ],
    troubleHeading: 'OBJ-to-STEP troubleshooting',
    troubleIntro:
      'Most issues are caused by mesh defects, undocumented units, dense topology or expecting rendering data and CAD features to survive the conversion.',
    problems: [
      {
        title: 'The STEP looks faceted',
        description: 'Cause: The output follows the OBJ polygons.',
        fix: 'Reduce unnecessary mesh density or request a native surface rebuild when smooth analytic faces are needed.',
      },
      {
        title: 'Materials and textures disappeared',
        description: 'Cause: OBJ visual data lives in MTL and texture files that do not map to this STEP workflow.',
        fix: 'Keep the original visual asset package and use STEP only for geometry exchange.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: OBJ does not enforce a standard unit.',
        fix: 'Confirm the authoring unit and rescale in the receiving CAD tool.',
      },
      {
        title: 'The STEP is open surfaces, not a solid',
        description: 'Cause: The OBJ is not watertight or contains invalid topology.',
        fix: 'Repair holes, non-manifold edges and self-intersections before retrying.',
      },
      {
        title: 'The file is too large or slow',
        description: 'Cause: A high polygon count can generate thousands of STEP faces.',
        fix: 'Decimate a copy while protecting critical dimensions.',
      },
      {
        title: 'The STEP is hard to modify',
        description: 'Cause: Conversion did not create sketches, constraints or native features.',
        fix: 'Commission a clean parametric rebuild for design changes.',
        href: '/cad-services',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related OBJ and STEP tools',
    relatedIntro: 'Use tools that support the same OBJ-to-STEP workflow.',
    relatedTools: [
      { title: 'Open OBJ viewer', description: 'Inspect polygon geometry', href: '/tools/obj-file-viewer', from: 'OBJ', viewer: true },
      { title: 'Open STEP viewer', description: 'Verify the converted CAD file', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'OBJ to STL', description: 'Create a slicer-friendly mesh', href: '/tools/convert-obj-to-stl', from: 'OBJ', to: 'STL' },
      { title: 'STEP to OBJ', description: 'Create a visualization mesh', href: '/tools/convert-step-to-obj', from: 'STEP', to: 'OBJ' },
      { title: 'OBJ to IGES', description: 'Try a legacy surface-exchange route', href: '/tools/convert-obj-to-iges', from: 'OBJ', to: 'IGES' },
      { title: 'Hire a CAD designer', description: 'Rebuild parametric geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of adjacent engineering, mesh and drawing handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to 3D-printing mesh' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Mesh to CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using a downloaded file.',
    faqHeading: 'Frequently asked questions about OBJ to STEP conversion',
    faqIntro: 'Clear answers about output behaviour, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert OBJ to STEP online?',
        answer: 'Upload the OBJ file (.obj), confirm STEP as the preselected output, start the conversion and download the STEP result (.step, .stp). Verify it in the application used for the next workflow.',
      },
      {
        question: 'Why convert OBJ to STEP?',
        answer: 'Use OBJ-to-STEP when a CAD, manufacturing or supplier workflow requires STEP and only the polygonal OBJ geometry—not its rendered appearance—needs to be exchanged.',
      },
      {
        question: 'Does OBJ to STEP create an editable parametric model?',
        answer: 'No. The STEP result is derived from the OBJ polygons. It does not recreate sketches, constraints, dimensions or native features, and it may remain a faceted shell or surface model.',
      },
      {
        question: 'Which OBJ and STEP extensions are supported?',
        answer: 'This route accepts .obj input and creates .step, .stp output.',
      },
      {
        question: 'Is the OBJ to STEP converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum OBJ file size?',
        answer: 'You can upload a OBJ file up to 300 MB. Dense meshes can produce large STEP files with many faces and slow CAD performance.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a production-ready CAD model from an OBJ?',
    designerBody:
      'Conversion transfers the mesh geometry, not the design intent. Work with a CAD designer when you need smooth surfaces, precise dimensions, tolerances, separate parts or an editable native feature tree.',
    designerSecondary: 'Convert another OBJ file',
  },
  'obj-to-iges': {
    meta: {
      title: 'Convert OBJ to IGES Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert OBJ mesh files to IGES online for legacy CAD and surface workflows. Secure uploads up to 300 MB, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert OBJ to IGES online',
    heroIntro:
      'Convert an OBJ (.obj) mesh to IGES (.iges or .igs) for legacy CAD/CAM and surface-exchange workflows. The output is derived from polygon faces; it does not restore smooth NURBS surfaces, native features, textures or design history.',
    badges: ['Free under 5 MB', 'OBJ → IGES', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your OBJ file',
    uploadHelper: 'Choose one OBJ file. This page is already configured to create IGES output.',
    dropzoneHead: 'Drag and drop your OBJ file here',
    convertCta: 'Convert OBJ to IGES',
    samplePrompt: 'No OBJ file available? Try a OBJ sample to see the workflow.',
    sampleCta: 'Try sample.obj',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the OBJ-to-IGES workflow in your browser without installing a CAD application or plugin.',
      },
      {
        title: 'Honest mesh-to-surface output',
        description: 'The IGES result packages geometry derived from OBJ polygons. It is not a reverse-engineered parametric CAD model.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the result in an IGES-compatible viewer or CAD/CAM application and check scale, surface count, gaps and file complexity.',
        href: '/tools/iges-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Private file handling',
        description: 'Files stay private, are never added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your CAD workflow',
    resourcesHeading: 'Inspect the OBJ, verify the IGES or request specialist help',
    resourcesIntro:
      'Inspect the OBJ mesh first, validate the IGES surfaces after conversion, or request reverse engineering when clean analytic surfaces are required.',
    resources: [
      {
        title: 'Check the source OBJ',
        description: 'Check for missing faces, inverted normals, disconnected objects, non-manifold edges and excessive polygon density.',
        href: '/tools/obj-file-viewer',
        cta: 'Open OBJ viewer',
      },
      {
        title: 'Inspect the IGES output',
        description: 'Confirm that the .iges or .igs file opens at the expected size and contains the expected entities or surface patches.',
        href: '/tools/iges-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Need smooth CAD surfaces?',
        description: 'Ask a CAD designer to rebuild planes, cylinders, fillets and NURBS surfaces when a faceted IGES result is not suitable.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert OBJ to IGES online',
    workflowIntro: 'Move from a Wavefront OBJ mesh to an IGES-compatible surface model in three steps.',
    workflowSteps: [
      ['Upload the OBJ file', 'Choose a .obj file up to 300 MB. Repair invalid polygons and confirm the intended scale before converting.'],
      ['Convert to IGES', 'The route is preconfigured for IGES. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .iges or .igs result in the receiving system. Verify dimensions, surface orientation, gaps and usable entity structure.'],
    ],
    workflowCta: 'Convert OBJ to IGES',
    behaviorHeading: 'What actually happens when OBJ is converted to IGES?',
    behaviorSummary:
      'OBJ stores polygonal geometry and may reference MTL materials, texture images, UV coordinates and object groups. IGES stores curves, wireframes and trimmed surfaces. Conversion translates the visible mesh geometry into IGES-compatible entities—often many faceted surface patches. It cannot infer the original smooth surfaces or parametric design intent.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Visible shape defined by OBJ polygons',
      'Vertex and face geometry',
      'Model orientation',
      'Separate objects or shells where supported',
      'Closed geometry only when the source mesh is suitable',
    ],
    changed: [
      'MTL materials, texture images and UV mapping',
      'Original sketches, constraints and feature history',
      'Exact analytic or NURBS surfaces',
      'Reliable physical units when none were supplied',
      'Some object names, groups and smoothing data',
    ],
    comparisonHeading: 'OBJ versus IGES',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Data model', 'Polygon mesh', 'Curves, wireframes and trimmed surfaces'],
      ['Visual data', 'May use MTL, textures and UVs', 'Not designed for modern texture workflows'],
      ['Units', 'No universal unit convention', 'Can carry unit metadata, but verify import interpretation'],
      ['Editability', 'Mesh and vertex editing', 'Surface/entity editing; no recovered feature tree'],
      ['Best use', 'Visualization, scanning and asset exchange', 'Legacy CAD/CAM and surface exchange'],
    ],
    chooseToHeading: 'Choose IGES when',
    chooseTo: [
      'A supplier or application specifically requires IGES',
      'You need a surface-exchange container for legacy CAD/CAM',
      'You can accept faceted geometry derived from the mesh',
      'You will verify the result before manufacturing',
    ],
    keepFromHeading: 'Keep OBJ when',
    keepFrom: [
      'Materials, textures or UVs matter',
      'The next step is rendering or mesh editing',
      'You need to preserve polygon groups or smoothing data',
      'A faceted IGES offers no downstream advantage',
    ],
    checksHeading: 'Check the converted IGES before using it',
    checksIntro:
      'OBJ and IGES represent different types of data. Review the output carefully before quoting, machining or continuing surface work.',
    checks: [
      ['Verify dimensions and unit interpretation', 'OBJ does not enforce a universal physical unit. Measure a known feature in the IGES result.'],
      ['Inspect surface count and complexity', 'Dense meshes can create thousands of IGES entities and slow the receiving application.'],
      ['Check open edges and gaps', 'Look for disconnected patches, overlaps, missing polygons and boundaries that failed to translate.'],
      ['Review orientation and normals', 'Confirm that faces are not reversed and the model displays consistently.'],
      ['Confirm lost visual data', 'Check whether materials, colors, textures and UVs are required elsewhere; keep the original OBJ and assets.'],
      ['Open the target application', 'Test the file in the exact CAD or CAM system used next.'],
    ],
    troubleHeading: 'OBJ-to-IGES troubleshooting',
    troubleIntro:
      'Most issues come from invalid polygons, missing unit context, dense meshes or expecting IGES to preserve OBJ visual assets.',
    problems: [
      {
        title: 'The IGES file is huge or slow',
        description: 'Cause: Each polygon may become one or more surface entities.',
        fix: 'Create a copy of the OBJ and decimate non-critical detail before retrying.',
      },
      {
        title: 'Textures or materials disappeared',
        description: 'Cause: IGES does not preserve the OBJ/MTL texture workflow.',
        fix: 'Keep the OBJ, MTL and image files as the visual source of truth.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: The source unit was implicit or interpreted differently.',
        fix: 'Measure a known feature and apply the intended unit or scale.',
      },
      {
        title: 'Faces are missing or reversed',
        description: 'Cause: The OBJ contains invalid polygons, open edges or inconsistent normals.',
        fix: 'Repair topology and recalculate normals before conversion.',
      },
      {
        title: 'The result is not a smooth CAD model',
        description: 'Cause: Format conversion follows the mesh facets.',
        fix: 'Use reverse engineering when analytic surfaces are required.',
      },
      {
        title: 'The file fails in the receiving system',
        description: 'Cause: It may exceed entity limits or contain unsupported geometry.',
        fix: 'Simplify the source and test a smaller sample; request specialist help if needed.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related OBJ and IGES tools',
    relatedIntro: 'Use tools that support the same OBJ-to-IGES workflow.',
    relatedTools: [
      { title: 'OBJ file viewer', description: 'inspect the source mesh', href: '/tools/obj-file-viewer', from: 'OBJ', viewer: true },
      { title: 'IGES file viewer', description: 'verify the converted surfaces', href: '/tools/iges-file-viewer', from: 'IGES', viewer: true },
      { title: 'OBJ to STEP', description: 'create a STEP-compatible mesh-derived output', href: '/tools/convert-obj-to-step', from: 'OBJ', to: 'STEP' },
      { title: 'OBJ to BREP', description: 'try a topology-based CAD container', href: '/tools/convert-obj-to-brep', from: 'OBJ', to: 'BREP' },
      { title: 'IGES to STEP', description: 'move legacy surfaces into STEP', href: '/tools/convert-iges-to-step', from: 'IGES', to: 'STEP' },
      { title: 'Hire a CAD designer', description: 'rebuild clean native geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore adjacent engineering and mesh handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to printable mesh' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'legacy surface exchange' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'legacy surfaces to STEP' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro:
      'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using it.',
    faqHeading: 'Frequently asked questions about OBJ to IGES conversion',
    faqIntro: 'Clear answers about output behavior, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert OBJ to IGES online?',
        answer:
          'Upload OBJ (.obj), confirm IGES as the preselected output, convert and download IGES (.iges, .igs). Verify the result in the target application.',
      },
      {
        question: 'Why convert OBJ to IGES?',
        answer:
          'Use IGES when a legacy CAD/CAM system or supplier requires .igs or .iges and the mesh-derived geometry is acceptable.',
      },
      {
        question: 'Does OBJ to IGES create smooth NURBS surfaces?',
        answer:
          'No. Automatic conversion translates the polygon mesh into IGES-compatible entities. It does not reliably reconstruct original analytic or NURBS surfaces.',
      },
      {
        question: 'Which OBJ and IGES extensions are supported?',
        answer: 'This route accepts .obj input and creates .iges, .igs output.',
      },
      {
        question: 'Is the OBJ to IGES converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum OBJ file size?',
        answer:
          'You can upload a OBJ file up to 300 MB. High polygon counts can produce very large IGES files and long import times.',
      },
      {
        question: 'How are my files handled?',
        answer:
          'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    designerTitle: 'Need a clean, editable CAD model?',
    designerBody:
      'Changing OBJ into IGES does not recreate design intent. Use a vetted CAD designer when the job requires smooth surfaces, tolerances or production-ready native geometry.',
    designerSecondary: 'Convert another OBJ file',
  },
  'step-to-stl': {
    meta: {
      title: 'Convert STEP to STL Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert STEP or STP files to STL online for 3D printing and slicing. Secure uploads up to 300 MB, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert STEP to STL online',
    heroIntro:
      'Convert a STEP or STP (.step, .stp) CAD model to STL (.stl) for 3D printing, slicing and rapid prototyping. The converter tessellates CAD surfaces into triangles; always verify units, watertightness, facet density and thin features before printing.',
    badges: ['Free under 5 MB', 'STEP → STL', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your STEP file',
    uploadHelper: 'Choose one STEP file. This page is already configured to create STL output.',
    dropzoneHead: 'Drag and drop your STEP CAD file here',
    convertCta: 'Convert STEP to STL',
    samplePrompt: 'No STEP file available? Try a STEP sample to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the STEP-to-STL workflow in your browser without installing a CAD application or conversion plugin.',
      },
      {
        title: 'Purpose-built mesh output',
        description: 'Create an STL for slicing and mesh workflows while keeping the original STEP as the editable engineering source.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the STL in a viewer or slicer to check scale, watertightness, triangle quality, surface smoothness and printability.',
        href: '/tools/stl-file-viewer',
        cta: 'Open STL viewer',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your workflow',
    resourcesHeading: 'Inspect the STEP, verify the STL or request specialist help',
    resourcesIntro:
      'Inspect the STEP source, validate the generated mesh in the STL viewer and request design support when geometry needs repair before printing.',
    resources: [
      {
        title: 'Check the source STEP',
        description: 'Confirm that the source contains the expected bodies, surfaces and components before tessellation.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Inspect the STL output',
        description: 'Inspect the mesh for holes, reversed normals, visible faceting, scale errors and missing thin features.',
        href: '/tools/stl-file-viewer',
        cta: 'Open STL viewer',
      },
      {
        title: 'Need a print-ready model?',
        description: 'Ask a CAD designer to repair solids, add wall thickness, close gaps, orient parts or redesign features that are too thin for the chosen process.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert STEP to STL online',
    workflowIntro: 'Move from a STEP solid or surface model to a tessellated STL mesh in three steps.',
    workflowSteps: [
      ['Upload the STEP file', 'Choose a .step or .stp file up to 300 MB. Ensure the source bodies are complete and correctly scaled.'],
      ['Convert to STL', 'The route is preconfigured for STL output. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .stl in the target slicer. Confirm the intended unit, dimensions, watertightness, orientation and mesh detail before generating toolpaths.'],
    ],
    workflowCta: 'Convert STEP to STL',
    behaviorHeading: 'What actually happens when STEP is converted to STL?',
    behaviorSummary:
      "STEP stores CAD curves, surfaces, solids and product structure. STL stores only a triangular surface mesh. Conversion tessellates the STEP faces according to the engine's mesh settings. Curved surfaces become triangles, while assemblies, colors, names, materials, feature history and exact analytic geometry are not carried into standard STL.",
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Visible external shape within the tessellation tolerance',
      'Overall orientation',
      'Closed volumes when source solids tessellate correctly',
      'Separate shells or bodies where the exporter supports them',
      'Surface detail large enough to be represented by the mesh',
    ],
    changed: [
      'Sketches, constraints and parametric feature history',
      'Exact cylinders, planes, NURBS and other analytic surfaces',
      'Assembly relationships, part names and product structure',
      'Colors, materials and most CAD metadata',
      'Explicit unit information in standard STL',
    ],
    comparisonHeading: 'STEP versus STL',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Primary use', 'CAD exchange, manufacturing and engineering revision', '3D printing, slicing and mesh processing'],
      ['Geometry', 'Exact B-rep curves, surfaces and solids', 'Triangular approximation of the surface'],
      ['Editability', 'Can support CAD operations; native feature history still depends on source', 'Mesh editing with no parametric features'],
      ['Units', 'Supports explicit units', 'Standard STL does not store a unit'],
      ['Structure and metadata', 'Can contain assemblies, names, colors and product data', 'Normally only triangle geometry and normals'],
    ],
    chooseToHeading: 'Choose STL when',
    chooseTo: [
      'The next step is slicing or 3D printing',
      'A mesh-based simulation or visualization tool requires STL',
      'You have checked that the tessellation captures critical detail',
      'You will keep the STEP as the engineering source',
    ],
    keepFromHeading: 'Keep STEP when',
    keepFrom: [
      'The design will be modified or manufactured from exact CAD geometry',
      'Assemblies, names, colors or metadata matter',
      'The receiving workflow accepts STEP directly',
      'You need smooth analytic surfaces rather than a triangle approximation',
    ],
    checksHeading: 'Check the converted STL before using it',
    checksIntro:
      'The STL must represent the shape at the correct scale and with enough mesh quality for the chosen manufacturing process.',
    checks: [
      ['Verify units and dimensions', 'STL has no standard unit field. Measure a known feature in the slicer and assign millimetres, inches or the intended unit.'],
      ['Inspect curved-surface faceting', 'Zoom into arcs, holes and fillets to confirm that triangles are fine enough for the required finish.'],
      ['Check watertightness and normals', 'Look for open boundaries, inverted faces, self-intersections and non-manifold edges.'],
      ['Review thin walls and small features', "Confirm that tessellation retained features near the printer's minimum wall and detail limits."],
      ['Confirm bodies and assemblies', 'Check whether multiple STEP components were exported as the required separate shells or one combined mesh.'],
      ['Test in the target slicer', 'Generate a preview and inspect layer paths, supports, orientation and estimated print behaviour.'],
    ],
    troubleHeading: 'STEP-to-STL troubleshooting',
    troubleIntro:
      "Most problems come from unit ambiguity, inappropriate tessellation, invalid source faces or features too small for the mesh and printing process.",
    problems: [
      {
        title: 'Curves look visibly faceted',
        description: 'Cause: The tessellation is too coarse for the model size or required finish.',
        fix: 'Use an export with a tighter chord tolerance, or rebuild the STL from CAD with controlled mesh settings.',
      },
      {
        title: 'The STL is enormous',
        description: 'Cause: The mesh is finer than the workflow needs.',
        fix: 'Reduce triangle density while preserving dimensional and curved-surface accuracy.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: The slicer guessed a different unit because STL does not store one.',
        fix: 'Select the intended unit or apply the correct scale before slicing.',
      },
      {
        title: 'The slicer reports holes or non-manifold edges',
        description: 'Cause: Source surfaces did not form a clean closed solid or tessellation created invalid boundaries.',
        fix: 'Repair the STEP body or heal the STL mesh before printing.',
      },
      {
        title: 'Parts are merged or missing',
        description: 'Cause: Assembly components or hidden bodies were exported differently than expected.',
        fix: 'Compare body count with the STEP source and export required parts separately.',
      },
      {
        title: 'Small holes or walls disappeared',
        description: 'Cause: Features are below the tessellation or manufacturing resolution.',
        fix: 'Use a finer export or redesign features for the target process.',
        href: '/cad-services',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related STEP and STL tools',
    relatedIntro: 'Use tools that support the same STEP-to-STL workflow.',
    relatedTools: [
      { title: 'Open STEP viewer', description: 'Inspect the source CAD model', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'Open STL viewer', description: 'Check the generated mesh', href: '/tools/stl-file-viewer', from: 'STL', viewer: true },
      { title: 'STL to STEP', description: 'Return a mesh to a CAD exchange container', href: '/tools/convert-stl-to-step', from: 'STL', to: 'STEP' },
      { title: 'STEP to OBJ', description: 'Create a mesh for visualization', href: '/tools/convert-step-to-obj', from: 'STEP', to: 'OBJ' },
      { title: 'STEP to 3DM', description: 'Prepare geometry for Rhino', href: '/tools/convert-step-to-3dm', from: 'STEP', to: '3DM' },
      { title: 'Hire a CAD designer', description: 'Repair or optimize a print-ready model', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of adjacent engineering, mesh and drawing handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Mesh to CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using a downloaded file.',
    faqHeading: 'Frequently asked questions about STEP to STL conversion',
    faqIntro: 'Clear answers about output behaviour, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert STEP to STL online?',
        answer: 'Upload the STEP file (.step, .stp), confirm STL as the preselected output, start the conversion and download the STL result (.stl). Verify it in the application used for the next workflow.',
      },
      {
        question: 'Why convert STEP to STL?',
        answer: 'Convert STEP to STL when the next workflow requires a triangle mesh—most commonly slicing and 3D printing—while retaining STEP as the editable source of truth.',
      },
      {
        question: 'How accurate is a STEP-to-STL conversion?',
        answer: 'Accuracy depends on the tessellation used to approximate STEP surfaces with triangles. Inspect curved faces, dimensions and small features; for tolerance-critical work, use a controlled CAD export and record the mesh settings.',
      },
      {
        question: 'Which STEP and STL extensions are supported?',
        answer: 'This route accepts .step, .stp input and creates .stl output.',
      },
      {
        question: 'Is the STEP to STL converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum STEP file size?',
        answer: 'You can upload a STEP file up to 300 MB. Complex CAD and fine tessellation can create very large triangle counts and slower slicer performance.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a reliable print-ready STL?',
    designerBody:
      'Conversion creates the mesh, but it does not fix weak geometry or poor print design. Work with a CAD designer when the model needs solid repair, wall-thickness changes, part separation, tolerances or process-specific optimization.',
    designerSecondary: 'Convert another STEP file',
  },
  'dxf-to-dwg': {
    meta: {
      title: 'Convert DXF to DWG Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert DXF drawings to DWG online for AutoCAD and drafting workflows. Secure uploads up to 300 MB, free downloads under 5 MB and no software required.',
    },
    h1: 'Convert DXF to DWG online',
    heroIntro:
      'Convert a DXF (.dxf) drawing to DWG (.dwg) for AutoCAD and DWG-compatible drafting workflows. Supported geometry, layers, blocks, dimensions and text can transfer, but fonts, external references, proxy objects, plot settings and application-specific data must be checked after conversion.',
    badges: ['Free under 5 MB', 'DXF → DWG', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your DXF file',
    uploadHelper: 'Choose one DXF file. This page is already configured to create DWG output.',
    dropzoneHead: 'Drag and drop your DXF drawing here',
    convertCta: 'Convert DXF to DWG',
    samplePrompt: 'No DXF file available? Try a DXF sample to see the conversion workflow.',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the DXF-to-DWG workflow in your browser without installing a CAD application or conversion plugin.',
      },
      {
        title: 'Drawing-aware exchange',
        description: 'Move supported DXF entities into a DWG-compatible file while keeping the original DXF as the neutral exchange source.',
      },
      {
        title: 'Ready to inspect',
        description: 'Open the DWG in the target drafting application and compare units, layers, blocks, hatches, dimensions, text and layouts with the original drawing.',
        cta: 'Open in a DWG-compatible application',
      },
      {
        title: 'Private file handling',
        description: 'Conversion files stay private, are not added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your workflow',
    resourcesHeading: 'Inspect the DXF, verify the DWG or request specialist help',
    resourcesIntro:
      'Review the DXF source, validate the converted DWG in the receiving application and request drafting support when unsupported entities need reconstruction.',
    resources: [
      {
        title: 'Check the source DXF',
        description: 'Confirm model-space geometry, units, layers, blocks, hatches, text and external dependencies before conversion.',
        cta: 'Open in a DXF-compatible viewer',
      },
      {
        title: 'Inspect the DWG output',
        description: 'Compare the DWG with the DXF and verify the exact entities, annotations and layouts required downstream.',
        cta: 'Open in a DWG-compatible application',
      },
      {
        title: 'Need a production-ready drawing?',
        description: 'Ask a CAD drafter to repair missing entities, relink references, substitute fonts and line types, or rebuild layouts and plotting standards.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert DXF to DWG online',
    workflowIntro: 'Move from a DXF exchange drawing to a DWG-compatible drawing in three steps.',
    workflowSteps: [
      ['Upload the DXF file', 'Choose one .dxf file up to 300 MB. Confirm that it opens correctly and that any required fonts, line types, images or references are available.'],
      ['Convert to DWG', 'The route is preconfigured for DWG output. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .dwg in the exact CAD version used downstream. Compare extents, units, layers, text, dimensions, blocks, hatches and model or paper space.'],
    ],
    workflowCta: 'Convert DXF to DWG',
    behaviorHeading: 'What actually happens when DXF is converted to DWG?',
    behaviorSummary:
      'DXF is a documented exchange representation for CAD entities; DWG is a compact native drawing format used by AutoCAD and compatible tools. Conversion maps supported lines, arcs, polylines, blocks, layers, text, dimensions and other entities into DWG. Unsupported custom objects, proxy data, xrefs, fonts, plot styles and version-specific metadata may be omitted or represented differently.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Supported 2D geometry such as lines, arcs, circles and polylines',
      'Standard layers, colors and line types where available',
      'Blocks and inserts supported by the converter',
      'Basic text, dimensions and hatches where compatible',
      'Drawing coordinates, extents and unit settings when explicitly defined',
    ],
    changed: [
      'Application-specific proxy or custom objects',
      'Missing external references, images and underlays',
      'Fonts, shape files, plot styles or custom line types not embedded in the DXF',
      'Associativity, constraints and metadata without a DWG equivalent',
      'Unsupported 3D entities or version-specific features',
    ],
    comparisonHeading: 'DXF versus DWG',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Primary use', 'Interoperable CAD exchange, CAM and drawing handoff', 'Native AutoCAD and DWG-compatible drafting workflow'],
      ['Storage', 'ASCII or binary exchange representation', 'Compact binary drawing database'],
      ['Entities', 'Broad documented entity set; support varies by exporter', 'Rich native entities plus application-specific extensions'],
      ['Dependencies', 'Can reference fonts, images, line types and xrefs', 'Can also depend on external assets and plot resources'],
      ['Best source of truth', 'Useful neutral handoff file', 'Preferred working file when the team edits and plots in a DWG workflow'],
    ],
    chooseToHeading: 'Choose DWG when',
    chooseTo: [
      'The client, supplier or drafting team specifically requires .dwg',
      'The drawing will be edited or plotted in AutoCAD or a DWG-compatible application',
      'You have verified fonts, xrefs, layouts and custom entities after conversion',
      'The target DWG version is accepted by the receiving system',
    ],
    keepFromHeading: 'Keep DXF when',
    keepFrom: [
      'The next tool prefers DXF for exchange, CNC or laser workflows',
      'You need a readable neutral handoff rather than a native working file',
      'The DWG conversion drops unsupported objects or dependencies',
      'DXF remains the agreed contractual delivery format',
    ],
    checksHeading: 'Check the converted DWG before using it',
    checksIntro:
      'A DWG can open without being visually or functionally identical to the DXF. Compare the drawings before issuing, plotting, machining or editing.',
    checks: [
      ['Verify drawing units and extents', 'Confirm INSUNITS or the intended scale, then measure known dimensions and compare total drawing extents.'],
      ['Compare layers, colors and line types', 'Check that layer names, visibility, colors, lineweights and custom line types match the source.'],
      ['Review text and dimensions', 'Look for font substitution, reflow, missing symbols, altered dimension styles and broken annotative scaling.'],
      ['Inspect blocks and hatches', 'Confirm block inserts, attributes, dynamic behaviour and hatch boundaries display as required.'],
      ['Check model space, layouts and plotting', 'Verify model-space content, paper-space layouts, viewports, page setups and plot styles if present.'],
      ['Resolve external dependencies', 'Relink xrefs, images, underlays, fonts and support files before final delivery.'],
    ],
    troubleHeading: 'DXF-to-DWG troubleshooting',
    troubleIntro:
      'Most differences are caused by missing support files, version mismatches, unsupported entities or unit and layout settings—not by the .dwg extension itself.',
    problems: [
      {
        title: 'The DWG opens at the wrong scale',
        description: 'Cause: The DXF unit header is missing, inconsistent or interpreted differently.',
        fix: 'Confirm the intended unit and drawing extents, then set or scale the DWG correctly.',
      },
      {
        title: 'Text reflows or symbols are missing',
        description: 'Cause: The target system substituted unavailable SHX or TrueType fonts.',
        fix: 'Install or package the required fonts, or replace them with approved equivalents.',
      },
      {
        title: 'External references are missing',
        description: 'Cause: The DXF references files that were not included in the conversion.',
        fix: 'Collect and relink xrefs, images and underlays in the target CAD system.',
      },
      {
        title: 'Hatches or line types look different',
        description: 'Cause: Custom patterns or line-type definitions were not available or scaled differently.',
        fix: 'Load the required support files and verify LTSCALE, PSLTSCALE and hatch scale.',
      },
      {
        title: 'Some objects disappeared',
        description: 'Cause: Proxy, custom or unsupported 3D entities did not translate.',
        fix: 'Explode or export them to supported primitives in the source application, then convert again.',
      },
      {
        title: 'The receiving tool reports an incompatible DWG version',
        description: 'Cause: Its supported DWG release differs from the created file.',
        fix: 'Save or export to a version the recipient confirms, then reopen and validate.',
        href: '/cad-services',
        cta: 'Hire a CAD drafter',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential product geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related DXF and DWG tools',
    relatedIntro: 'Use tools that support the same DXF-to-DWG workflow.',
    relatedTools: [
      { title: 'DWG to DXF', description: 'Create a neutral drawing exchange file', href: '/tools/convert-dwg-to-dxf', from: 'DWG', to: 'DXF' },
      { title: '3D CAD File Converter', description: 'See other supported drawing and model routes', href: '/tools/3d-cad-file-converter', from: 'CAD', viewer: true },
      { title: 'Browse 2D technical drawings', description: 'Review drawing resources', href: '/library/2d-technical-drawings', from: '2D', viewer: true },
      { title: 'STEP to 2D drawings', description: 'Create views from a 3D model', href: '/tools/cad-drawing-pipeline', from: 'STEP', to: '2D' },
      { title: 'Hire a CAD designer', description: 'Repair or recreate drawing entities', href: '/cad-services', from: 'CAD', viewer: true },
      { title: 'CAD tools', description: 'Browse available Marathon OS tools', href: '/tools', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore a small set of adjacent engineering, mesh and drawing handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to 3D-printing mesh' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'Legacy surfaces to modern CAD exchange' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'Mesh to CAD exchange' },
      { label: 'OBJ to STL', path: '/obj-to-stl', oneLiner: 'Mesh handoff for slicing' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
      { label: 'DWG to DXF', path: '/dwg-to-dxf', oneLiner: 'Drawing exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro: 'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using a downloaded file.',
    faqHeading: 'Frequently asked questions about DXF to DWG conversion',
    faqIntro: 'Clear answers about output behaviour, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert DXF to DWG online?',
        answer: 'Upload the DXF file (.dxf), confirm DWG as the preselected output, start the conversion and download the DWG result (.dwg). Verify it in the application used for the next workflow.',
      },
      {
        question: 'Why convert DXF to DWG?',
        answer: 'Convert DXF to DWG when the receiving team works in AutoCAD or another DWG-based drafting environment and needs a native working container rather than a neutral exchange file.',
      },
      {
        question: 'Will DXF to DWG preserve every drawing element?',
        answer: 'Not always. Standard geometry and layers usually transfer more reliably than custom objects, xrefs, fonts, plot styles, dynamic blocks and application-specific metadata. Compare the result with the source drawing.',
      },
      {
        question: 'Which DXF and DWG extensions are supported?',
        answer: 'This route accepts .dxf input and creates .dwg output.',
      },
      {
        question: 'Is the DXF to DWG converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum DXF file size?',
        answer: 'You can upload a DXF file up to 300 MB. Dense hatches, many blocks, embedded 3D entities and external dependencies can increase processing and review time.',
      },
      {
        question: 'How are my files handled?',
        answer: 'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership of the uploaded design.',
      },
    ],
    designerTitle: 'Need a DWG that is ready to issue or manufacture from?',
    designerBody:
      'Format conversion creates the container, but production drawings still require checking. Work with a CAD drafter when the file needs repaired geometry, fonts, xrefs, layouts, dimensions, standards or a confirmed DWG version.',
    designerSecondary: 'Convert another DXF file',
  },
  '3dm-to-step': {
    meta: {
      title: 'Convert 3DM to STEP Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert Rhino 3DM files to STEP online for mechanical CAD and CAM workflows. Secure uploads up to 300 MB, free under 5 MB and no software required.',
    },
    h1: 'Convert 3DM to STEP online',
    heroIntro:
      'Convert a Rhino 3DM (.3dm) model to STEP (.step or .stp) for mechanical CAD, supplier handoff and CAD/CAM workflows. Compatible NURBS and B-rep geometry can transfer, while Rhino-specific layers, blocks, annotations, materials and mixed mesh data may change or be omitted.',
    badges: ['Free under 5 MB', '3DM → STEP', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your 3DM file',
    uploadHelper: 'Choose one 3DM file. This page is already configured to create STEP output.',
    dropzoneHead: 'Drag and drop your 3DM file here',
    convertCta: 'Convert 3DM to STEP',
    samplePrompt: 'No 3DM file available? Try a 3DM sample to see the workflow.',
    sampleCta: 'Try sample.3dm',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the 3DM-to-STEP workflow in your browser without installing a CAD application or plugin.',
      },
      {
        title: 'Built for Rhino-to-CAD exchange',
        description:
          'Preserve compatible solids and surfaces for STEP-based workflows while keeping the original 3DM as the source of truth.',
      },
      {
        title: 'Ready to inspect',
        description:
          'Open the STEP result in SolidWorks, Fusion 360, Inventor or the receiving CAD/CAM system and check bodies, units, trims and assembly expectations.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Private file handling',
        description: 'Files stay private, are never added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your CAD workflow',
    resourcesHeading: 'Inspect the 3DM, verify the STEP or request specialist help',
    resourcesIntro:
      'Inspect the source 3DM, validate the STEP output and use design support when Rhino-specific content must be rebuilt for the receiving CAD system.',
    resources: [
      {
        title: 'Check the source 3DM',
        description: 'Review solids, surfaces, curves, meshes, layers and visible objects before conversion.',
        href: '/tools/3dm-file-viewer',
        cta: 'Open 3DM viewer',
      },
      {
        title: 'Inspect the STEP output',
        description: 'Confirm that expected solids and surfaces open at the correct size and that trimmed faces and body status are valid.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Need a clean mechanical CAD model?',
        description:
          'Ask a CAD designer to rebuild missing features, assemblies, drawings, tolerances or Rhino-specific construction data in the target system.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert 3DM to STEP online',
    workflowIntro: 'Move from a Rhino 3DM model to a STEP exchange file in three steps.',
    workflowSteps: [
      ['Upload the 3DM file', 'Choose a .3dm file up to 300 MB. Remove hidden or duplicate geometry and confirm document units before conversion.'],
      ['Convert to STEP', 'The route is preconfigured for STEP. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .step or .stp file in the receiving CAD system. Check units, body count, trims, open edges and whether meshes transferred acceptably.'],
    ],
    workflowCta: 'Convert 3DM to STEP',
    behaviorHeading: 'What actually happens when 3DM is converted to STEP?',
    behaviorSummary:
      '3DM can store NURBS curves and surfaces, B-reps, meshes, layers, blocks, annotations, render materials and application-specific data. STEP focuses on product geometry and structure. Compatible NURBS/B-rep solids and surfaces generally translate best; meshes may remain faceted, while Rhino-specific organization and presentation data may not have an equivalent.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Compatible NURBS and B-rep shape',
      'Solid and surface geometry where supported',
      'Model orientation and explicit units',
      'Separate bodies or parts where supported',
      'Basic names or product data when mapped',
    ],
    changed: [
      'Rhino history and application-specific objects',
      'Some layers, blocks and object attributes',
      'Annotations, layouts, lights and render settings',
      'Materials, textures and UV data',
      'Mesh editability and some curve-only construction geometry',
    ],
    comparisonHeading: '3DM versus STEP',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Data model', 'NURBS, B-reps, meshes, curves and scene data', 'Product geometry, B-rep solids/surfaces and structure'],
      ['Organization', 'Layers, groups, blocks and object attributes', 'Parts/assemblies and product names where mapped'],
      ['Visual data', 'Can store materials, textures, lights and views', 'Limited presentation support in typical exchange'],
      ['Editability', 'Rich Rhino-native modeling data', 'Imported geometry without Rhino history'],
      ['Best use', 'Rhino design, surfacing and mixed geometry', 'Mechanical CAD/CAM and supplier exchange'],
    ],
    chooseToHeading: 'Choose STEP when',
    chooseTo: [
      'A mechanical CAD or CAM system requires STEP',
      'A supplier needs neutral B-rep geometry',
      'Compatible solids and surfaces matter more than Rhino scene data',
      'You will keep the 3DM as the editable source',
    ],
    keepFromHeading: 'Keep 3DM when',
    keepFrom: [
      'You are still editing in Rhino',
      'Layers, blocks, materials or annotations matter',
      'The file contains important meshes or plugins',
      'No STEP-based downstream requirement exists',
    ],
    checksHeading: 'Check the converted STEP before using it',
    checksIntro:
      'STEP is a strong geometry exchange format, but it is not a complete copy of the Rhino document. Compare geometry and organization before release.',
    checks: [
      ['Verify units and scale', 'Compare Rhino document units with the imported STEP units and measure a known feature.'],
      ['Count solids, surfaces and meshes', 'Confirm that every expected visible body transferred and note any mesh-derived output.'],
      ['Inspect trimmed surfaces', 'Look for gaps, missing trims, sliver faces and naked edges.'],
      ['Confirm body status', 'Check whether objects arrived as solids, open shells or separate surfaces.'],
      ['Review names and organization', 'Verify part names, layers, groups and blocks where they matter downstream.'],
      ['Open the exact receiving system', 'Test the STEP in the CAD/CAM application and version used by the recipient.'],
    ],
    troubleHeading: '3DM-to-STEP troubleshooting',
    troubleIntro:
      'Most issues come from mixed geometry, damaged trims, plugin-specific objects, hidden data or differences between Rhino organization and STEP product structure.',
    problems: [
      {
        title: 'Surfaces arrive with gaps',
        description: 'Cause: Trims or tolerances do not sew cleanly in the target kernel.',
        fix: 'Join/heal geometry in Rhino, reduce naked edges and export again.',
      },
      {
        title: 'Meshes are missing or faceted',
        description: 'Cause: Mesh objects have no native B-rep equivalent.',
        fix: 'Convert or rebuild critical mesh geometry before STEP export.',
      },
      {
        title: 'Layers or blocks changed',
        description: 'Cause: STEP product structure does not map one-to-one with Rhino layers and blocks.',
        fix: 'Use clear object/part names and verify organization after import.',
      },
      {
        title: 'Materials or textures disappeared',
        description: 'Cause: Typical STEP exchange does not preserve Rhino rendering data.',
        fix: 'Keep the 3DM and texture assets for visualization workflows.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: Document and import units were interpreted differently.',
        fix: 'Set explicit Rhino units and verify a known dimension in the STEP.',
      },
      {
        title: 'The recipient needs editable features',
        description: 'Cause: STEP transfers geometry, not Rhino modeling history or a target-native feature tree.',
        fix: 'Rebuild the required features in the destination CAD system.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related 3DM and STEP tools',
    relatedIntro: 'Use tools that support the same 3DM-to-STEP workflow.',
    relatedTools: [
      { title: '3DM file viewer', description: 'inspect the Rhino source', href: '/tools/3dm-file-viewer', from: '3DM', viewer: true },
      { title: 'STEP file viewer', description: 'verify the converted result', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'STEP to 3DM', description: 'move STEP geometry into Rhino', href: '/tools/convert-step-to-3dm', from: 'STEP', to: '3DM' },
      { title: '3DM to IGES', description: 'create a legacy surface-exchange file', href: '/tools/convert-3dm-to-iges', from: '3DM', to: 'IGES' },
      { title: 'STEP to STL', description: 'create a mesh for 3D printing', href: '/tools/convert-step-to-stl', from: 'STEP', to: 'STL' },
      { title: 'Hire a CAD designer', description: 'rebuild production-ready geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore adjacent engineering and mesh handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to printable mesh' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'legacy surface exchange' },
      { label: 'IGES to STEP', path: '/iges-to-step', oneLiner: 'legacy surfaces to STEP' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro:
      'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using it.',
    faqHeading: 'Frequently asked questions about 3DM to STEP conversion',
    faqIntro: 'Clear answers about output behavior, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert 3DM to STEP online?',
        answer:
          'Upload 3DM (.3dm), confirm STEP as the preselected output, convert and download STEP (.step, .stp). Verify the result in the target application.',
      },
      {
        question: 'Why convert 3DM to STEP?',
        answer:
          'Convert 3DM to STEP when a mechanical CAD/CAM system, supplier or manufacturer needs neutral product geometry rather than a Rhino document.',
      },
      {
        question: 'What 3DM data may not survive STEP conversion?',
        answer:
          'Rhino-specific history, layers, blocks, annotations, render materials, textures, views and plugin objects may change or be omitted. Compatible B-rep solids and NURBS surfaces transfer most reliably.',
      },
      {
        question: 'Which 3DM and STEP extensions are supported?',
        answer: 'This route accepts .3dm input and creates .step, .stp output.',
      },
      {
        question: 'Is the 3DM to STEP converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum 3DM file size?',
        answer:
          'You can upload a 3DM file up to 300 MB. Files with many detailed surfaces, meshes, blocks or hidden objects may take longer and create complex STEP output.',
      },
      {
        question: 'How are my files handled?',
        answer:
          'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    designerTitle: 'Need a target-native production model?',
    designerBody:
      'STEP is excellent for exchange, but it does not recreate a SolidWorks, Inventor or Fusion feature tree. Use a CAD designer when the recipient needs editable features, drawings, tolerances or assembly structure.',
    designerSecondary: 'Convert another 3DM file',
  },
  'iges-to-step': {
    meta: {
      title: 'Convert IGES to STEP Online – Free up to 5 MB | Marathon OS',
      description:
        'Convert IGES or IGS files to STEP online for modern CAD and manufacturing workflows. Secure uploads up to 300 MB, free under 5 MB and no software required.',
    },
    h1: 'Convert IGES to STEP online',
    heroIntro:
      'Convert an IGES (.iges or .igs) model to STEP (.step or .stp) for modern mechanical CAD, supplier exchange and manufacturing workflows. Compatible curves and trimmed surfaces can transfer, but conversion cannot restore the original feature tree or automatically repair every gap in legacy geometry.',
    badges: ['Free under 5 MB', 'IGES → STEP', 'No software installation'],
    trust: ['Encrypted uploads', 'Files up to 300 MB', 'Automatically deleted within 7 days'],
    uploadHeading: 'Upload your IGES file',
    uploadHelper: 'Choose one IGES file. This page is already configured to create STEP output.',
    dropzoneHead: 'Drag and drop your IGES file here',
    convertCta: 'Convert IGES to STEP',
    samplePrompt: 'No IGES file available? Try a IGES sample to see the workflow.',
    sampleCta: 'Try sample.iges',
    benefits: [
      {
        title: 'No desktop software',
        description: 'Start the IGES-to-STEP workflow in your browser without installing a CAD application or plugin.',
      },
      {
        title: 'Modernize legacy CAD exchange',
        description:
          'Move usable IGES geometry into a STEP container that is more common in current mechanical CAD workflows, then verify whether surfaces sew into valid bodies.',
      },
      {
        title: 'Ready to inspect',
        description:
          'Open the STEP result in the receiving CAD system and check units, missing entities, open edges, body status and product structure.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Private file handling',
        description: 'Files stay private, are never added to the public CAD library and are automatically deleted within 7 days.',
      },
    ],
    resourcesEyebrow: 'Continue your CAD workflow',
    resourcesHeading: 'Inspect the IGES, verify the STEP or request specialist help',
    resourcesIntro:
      'Inspect the IGES source, validate the STEP result and request geometry repair when legacy surfaces do not sew cleanly.',
    resources: [
      {
        title: 'Check the source IGES',
        description: 'Check scale, missing faces, surface boundaries and disconnected geometry before conversion.',
        href: '/tools/iges-file-viewer',
        cta: 'Open IGES viewer',
      },
      {
        title: 'Inspect the STEP output',
        description: 'Confirm expected bodies and surfaces, then inspect open edges, units and assembly or naming information.',
        href: '/tools/step-file-viewer',
        cta: 'Open STEP viewer',
      },
      {
        title: 'Need repaired solids or native features?',
        description: 'Ask a CAD designer to heal gaps, rebuild missing surfaces or recreate editable features in the target CAD system.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    workflowHeading: 'How to convert IGES to STEP online',
    workflowIntro: 'Move from a legacy IGES model to a STEP exchange file in three steps.',
    workflowSteps: [
      ['Upload the IGES file', 'Choose a .iges or .igs file up to 300 MB. Confirm that the source opens and contains the expected entities before converting.'],
      ['Convert to STEP', 'The route is preconfigured for STEP. Start the conversion without searching through a destination-format menu.'],
      ['Download and verify', 'Open the .step or .stp result in the receiving CAD system. Verify dimensions, surface continuity, body status and completeness.'],
    ],
    workflowCta: 'Convert IGES to STEP',
    behaviorHeading: 'What actually happens when IGES is converted to STEP?',
    behaviorSummary:
      'IGES commonly stores curves, wireframes and trimmed surfaces, often as loosely connected entities. STEP stores B-rep geometry and product structure. Conversion maps compatible entities and may sew adjacent surfaces into shells or solids when tolerances permit. It does not invent missing faces, recover native features or guarantee that an open IGES becomes a solid.',
    retainedHeading: 'What is normally retained',
    changedHeading: 'What is not retained or may change',
    retained: [
      'Compatible curves and trimmed surfaces',
      'Overall model shape and orientation',
      'Explicit unit information where present',
      'Entity names or layers when mapping exists',
      'Closed shells or solids when surfaces sew successfully',
    ],
    changed: [
      'Original sketches, constraints and feature history',
      'Unsupported or application-specific IGES entities',
      'Some layers, colors and metadata',
      'Assembly relationships not represented by the source',
      'Gaps or invalid trims that require manual healing',
    ],
    comparisonHeading: 'IGES versus STEP',
    comparisonIntro: 'Choose the format according to what the next application needs—not because one is universally better.',
    comparisonRows: [
      ['Data model', 'Curves, wireframes and trimmed surfaces', 'B-rep solids/surfaces and product structure'],
      ['Connectivity', 'May contain loosely associated surface entities', 'Supports connected topology and solid bodies'],
      ['Assemblies', 'Limited and inconsistently used', 'Can represent product/assembly structure'],
      ['Editability', 'Surface and curve editing; no universal feature history', 'Imported geometry; no recovered native feature tree'],
      ['Best use', 'Legacy CAD/CAM and surface exchange', 'Modern mechanical CAD and supplier exchange'],
    ],
    chooseToHeading: 'Choose STEP when',
    chooseTo: [
      'A current CAD/CAM system or supplier prefers STEP',
      'You need connected topology or product structure where available',
      'You want a more common mechanical CAD exchange container',
      'You can validate and heal legacy surfaces if required',
    ],
    keepFromHeading: 'Keep IGES when',
    keepFrom: [
      'The recipient specifically requires IGES',
      'A legacy system depends on particular IGES entities',
      'You are still repairing the source surfaces',
      'The conversion provides no practical downstream benefit',
    ],
    checksHeading: 'Check the converted STEP before using it',
    checksIntro:
      'IGES files often contain tolerance and connectivity problems. A STEP download should be inspected as geometry, not accepted merely because it opens.',
    checks: [
      ['Verify units and dimensions', 'Compare a known measurement in the IGES source and STEP result.'],
      ['Count expected entities and bodies', 'Confirm that no surfaces, curves or components disappeared.'],
      ['Inspect open edges and gaps', 'Check whether trimmed surfaces sewed into closed shells or remained open.'],
      ['Review body status', 'Identify solids, shells, compounds and separate surfaces in the receiving system.'],
      ['Check orientation and trims', 'Look for reversed faces, failed boundaries and sliver geometry.'],
      ['Validate product structure', 'Confirm names, parts and assembly hierarchy only when the source contained usable structure.'],
    ],
    troubleHeading: 'IGES-to-STEP troubleshooting',
    troubleIntro:
      'Most problems come from legacy entity support, loose surface tolerances, invalid trims, missing unit context or expecting conversion to heal incomplete geometry automatically.',
    problems: [
      {
        title: 'The STEP remains a surface model',
        description: 'Cause: The IGES surfaces are open or do not meet within sewing tolerance.',
        fix: 'Heal gaps and trims in a CAD system, then convert or save again.',
      },
      {
        title: 'Some faces or curves are missing',
        description: 'Cause: The source contains invalid or unsupported IGES entities.',
        fix: 'Identify the missing entities in the source and re-export using widely supported types.',
      },
      {
        title: 'The model is the wrong size',
        description: 'Cause: Units were absent or interpreted differently.',
        fix: 'Measure a known feature and set the intended unit in the receiving system.',
      },
      {
        title: 'Faces are reversed',
        description: 'Cause: Surface orientation or trim loops were inconsistent.',
        fix: 'Repair face orientation and boundaries in the source or target CAD system.',
      },
      {
        title: 'Assembly structure is missing',
        description: 'Cause: IGES often lacks reliable modern product hierarchy.',
        fix: 'Recreate the required structure after import or use a better source file.',
      },
      {
        title: 'The file opens but cannot be edited parametrically',
        description: 'Cause: STEP contains imported geometry, not the original feature tree.',
        fix: 'Use direct editing or commission a target-native rebuild.',
        href: '/cad-services',
        cta: 'Hire a CAD designer',
      },
    ],
    privacyHeading: 'Your design files remain yours',
    privacyIntro:
      'Engineering files can contain confidential geometry and documentation. Marathon OS keeps conversion uploads separate from its public CAD library and explains how each file is handled.',
    privacyItems: [
      { title: 'Encrypted transfer', description: 'Files are transferred over an encrypted connection.' },
      { title: 'Automatic deletion', description: 'Uploaded source files and converted outputs are automatically deleted within 7 days.' },
      { title: 'You retain ownership', description: 'Uploading or converting a file does not transfer ownership of the design to Marathon OS.' },
      { title: 'Never published automatically', description: 'Conversion files are not listed in the public Marathon OS CAD library.' },
    ],
    relatedHeading: 'Related IGES and STEP tools',
    relatedIntro: 'Use tools that support the same IGES-to-STEP workflow.',
    relatedTools: [
      { title: 'IGES file viewer', description: 'inspect the legacy source', href: '/tools/iges-file-viewer', from: 'IGES', viewer: true },
      { title: 'STEP file viewer', description: 'verify the converted result', href: '/tools/step-file-viewer', from: 'STEP', viewer: true },
      { title: 'STEP to IGES', description: 'create an IGES handoff', href: '/tools/convert-step-to-iges', from: 'STEP', to: 'IGES' },
      { title: 'IGES to STL', description: 'create a printable mesh', href: '/tools/convert-iges-to-stl', from: 'IGES', to: 'STL' },
      { title: '3DM to STEP', description: 'convert Rhino geometry to STEP', href: '/tools/convert-3dm-to-step', from: '3DM', to: 'STEP' },
      { title: 'Hire a CAD designer', description: 'heal or rebuild geometry', href: '/cad-services', from: 'CAD', viewer: true },
    ],
    popularHeading: 'Popular CAD conversion workflows',
    popularIntro: 'Explore adjacent engineering and mesh handoffs.',
    popularCta: 'View all conversion tools',
    popular: [
      { label: 'STEP to STL', path: '/step-to-stl', oneLiner: 'CAD to printable mesh' },
      { label: 'STL to STEP', path: '/stl-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'OBJ to STEP', path: '/obj-to-step', oneLiner: 'mesh to CAD exchange' },
      { label: 'STEP to IGES', path: '/step-to-iges', oneLiner: 'legacy surface exchange' },
      { label: '3DM to STEP', path: '/3dm-to-step', oneLiner: 'Rhino to CAD/CAM exchange' },
    ],
    designHubHeading: 'Find an existing model before rebuilding one',
    designHubIntro:
      'Search the Marathon OS library for a usable starting model. Review dimensions, licensing and manufacturing suitability before using it.',
    faqHeading: 'Frequently asked questions about IGES to STEP conversion',
    faqIntro: 'Clear answers about output behavior, compatibility, pricing, file limits and privacy.',
    faqs: [
      {
        question: 'How do I convert IGES to STEP online?',
        answer:
          'Upload IGES (.iges, .igs), confirm STEP as the preselected output, convert and download STEP (.step, .stp). Verify the result in the target application.',
      },
      {
        question: 'Why convert IGES to STEP?',
        answer:
          'Convert IGES to STEP when the receiving CAD/CAM system or supplier prefers STEP and you need a modern B-rep exchange container for legacy surface geometry.',
      },
      {
        question: 'Will IGES to STEP turn every surface model into a solid?',
        answer:
          'No. Surfaces can form a solid only when they are complete, correctly trimmed and close enough to sew. Gaps or missing faces require repair.',
      },
      {
        question: 'Which IGES and STEP extensions are supported?',
        answer: 'This route accepts .iges, .igs input and creates .step, .stp output.',
      },
      {
        question: 'Is the IGES to STEP converter free?',
        answer: 'Files under 5 MB can be converted and downloaded free. Larger files use one credit for one completed download.',
      },
      {
        question: 'What is the maximum IGES file size?',
        answer:
          'You can upload a IGES file up to 300 MB. Legacy files with many surface patches, curves or invalid entities can take longer to process and review.',
      },
      {
        question: 'How are my files handled?',
        answer:
          'Files are transferred securely, are not published to the public CAD library and are automatically deleted within 7 days. You retain ownership.',
      },
    ],
    designerTitle: 'Need a healed solid or editable feature model?',
    designerBody:
      'Conversion can modernize the exchange format, but it cannot invent missing geometry or recover design history. Use a CAD designer when the result needs healing, remodeling, tolerances or target-native features.',
    designerSecondary: 'Convert another IGES file',
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
