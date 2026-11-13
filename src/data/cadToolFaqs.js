/**
 * CAD tool FAQ content (converter + viewer). Import from Server or Client components.
 * Edit this file to change questions/answers sitewide for those pages.
 */

import { getUniquePairPage } from '@/data/converterPairUniquePages'
import { THREE_MF_PAIR_FAQS } from '@/data/threeMfPairFaqs'
import { getUniqueViewerPage } from '@/data/viewerUniquePages'

function parseConversionParams(conversionParams) {
  if (!conversionParams || typeof conversionParams !== 'string') return { from: '', to: '' };
  const segment = conversionParams.split('/').filter(Boolean).pop() || conversionParams;
  const parts = segment.split(/-to-|_to_|_/i);
  const from = (parts[0] || '').replace(/\.\w+$/, '');
  const to = (parts[1] || '').replace(/\.\w+$/, '');
  return { from, to };
}

const FORMAT_EXTENSIONS = {
  step: '.step or .stp',
  stp: '.step or .stp',
  iges: '.igs or .iges',
  igs: '.igs or .iges',
  stl: '.stl',
  obj: '.obj',
  ply: '.ply',
  off: '.off',
  brep: '.brp or .brep',
  brp: '.brp or .brep',
  '3dm': '.3dm',
  '3mf': '.3mf',
  dwg: '.dwg',
  dxf: '.dxf',
};

function getFormatExtensions(format) {
  const key = String(format || '').toLowerCase();
  return FORMAT_EXTENSIONS[key] || `.${key}`;
}

const WHY_CONVERT_HINTS = {
  'stl-step': 'STL mesh files are ideal for 3D printing but hard to edit in CAD. Converting STL to STEP gives you a solid model you can modify, dimension, and use in manufacturing workflows.',
  'step-stl': 'STEP is the standard exchange format for CAD. Converting STEP to STL creates a mesh file ready for 3D printing, slicing, and rapid prototyping.',
  'iges-step': 'IGES is a legacy surface-based format. Converting IGES to STEP improves compatibility with modern CAD systems and downstream manufacturing tools.',
  'step-iges': 'Converting STEP to IGES helps share models with older CAD systems or suppliers that still require IGES exchange files.',
  'obj-stl': 'OBJ meshes are common in rendering pipelines. Converting OBJ to STL prepares your model for 3D printing and slicer software.',
  'stl-obj': 'Converting STL to OBJ can help when you need a widely supported mesh format for rendering, game engines, or visualization tools.',
  'dwg-dxf': 'DWG is AutoCAD’s native format. Converting DWG to DXF improves interoperability with other 2D CAD and CAM tools.',
  'dxf-dwg': 'Converting DXF to DWG is useful when you need a native AutoCAD file from a neutral 2D exchange format.',
  'step-3dm': 'STEP is the standard CAD exchange format. Converting STEP to 3DM produces a Rhino-compatible mesh you can open in Rhinoceros without a STEP import plugin.',
  '3dm-step': 'Converting 3DM to STEP helps move Rhino models into CAD/CAM and manufacturing workflows that expect STEP exchange files.',
  'stl-3dm': 'Converting STL to 3DM lets you bring printable meshes into Rhino for surfacing, editing, and visualization.',
  '3dm-stl': 'Converting 3DM to STL prepares Rhino models for 3D printing, slicing, and mesh-based review.',
  'step-3mf': 'Converting STEP to 3MF gives slicers such as PrusaSlicer, Bambu Studio, OrcaSlicer and Cura a print file with units, and each solid becomes its own named, coloured object.',
  '3mf-step': 'Converting 3MF to STEP moves a print file into CAD tools that expect a neutral exchange format. The mesh becomes faceted geometry; it does not recover the original feature history.',
  'stl-3mf': 'Converting STL to 3MF adds a declared unit to the mesh, so modern slicers open the part at the right size.',
  '3mf-stl': 'Converting 3MF to STL is useful when a print service or older slicer only accepts STL. Colours and object names are not kept, because STL cannot store them.',
};

function getWhyConvertAnswer(from, to) {
  const key = `${from}-${to}`.toLowerCase();
  if (WHY_CONVERT_HINTS[key]) return WHY_CONVERT_HINTS[key];
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  return `Converting ${fromUpper} to ${toUpper} helps you move CAD data between tools, suppliers, and workflows without installing desktop software. Marathon OS handles the conversion in the cloud so you can download a ${toUpper} file in seconds.`;
}

const STEP_TO_3DM_FAQS = [
  {
    question: 'How do I convert a STEP file to 3DM?',
    answer: "Upload your .step or .stp file to the converter at the top of this page and download a Rhino 7 .3dm with the model as one mesh in millimetres. If you have Rhino and need NURBS, open the STEP in Rhino instead; that's free if you already own Rhino. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Will the 3DM have NURBS surfaces?',
    answer: 'No. Our STEP to 3DM conversion writes a triangle mesh, not NURBS. For editable NURBS, open the STEP in Rhino: Rhino imports STEP as NURBS surfaces and polysurfaces.',
  },
  {
    question: 'Can Rhino open STEP files directly?',
    answer: "Yes. Rhino opens and imports .step and .stp files as NURBS surfaces and polysurfaces. If you have Rhino, that's the better route for geometry you want to edit.",
  },
  {
    question: 'Is the Marathon OS STEP to 3DM converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to 3DM?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Which Rhino versions open the file?',
    answer: "It's a Rhino 7 file, so Rhino 7 and Rhino 8 open it. Rhino 6 and earlier can't open Rhino 7 files.",
  },
  {
    question: 'What units does the 3DM use?',
    answer: "Millimetres, stored as the file's model units.",
  },
  {
    question: 'Can I edit the mesh in Rhino?',
    answer: "You can move, scale, cut and join it with Rhino's mesh tools. MeshToNURB turns each triangle into a flat surface, which isn't the same as the original NURBS geometry.",
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh object without part names, layers or colours.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every file is meshed at the same setting: a 0.15 mm chord tolerance and about 29° between neighbouring triangles, the same as our STEP to STL converter. There are no quality presets, and a part that won't mesh at that setting is re-meshed slightly coarser. Need a finer mesh? Export from your CAD program at a smaller deviation.",
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including the mesh setting used, the triangle count, a bounding-box match with the STEP, the surface-area ratio, missing area, whether the mesh is watertight and the number of bodies.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to 3DM conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_3MF_FAQS = [
  {
    question: 'How do I convert a STEP file to 3MF?',
    answer: "Upload your .step or .stp file to the converter at the top of this page and download a 3MF with one object per part, in millimetres. Bambu Studio, PrusaSlicer and OrcaSlicer can also import STEP themselves. Marathon OS is the paid route if your slicer can't: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS STEP to 3MF converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to 3MF?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Will each part be a separate object?',
    answer: 'Yes. Each solid in the STEP becomes its own object in the 3MF, in its assembled position, so you can arrange or assign filaments per part. Loose surfaces in the STEP come through as a separate object.',
  },
  {
    question: 'Will colours carry over?',
    answer: "They can. When the STEP has colours, each part can take its STEP colour as a 3MF display colour, one colour per part, and parts coloured face by face take their first face's colour. Check them in your slicer before you print. If our part-by-part writer can't process the file, you get one uncoloured object named after the file.",
  },
  {
    question: 'Does the 3MF keep units?',
    answer: 'Yes. The 3MF stores millimetres, so slicers open it at the right size.',
  },
  {
    question: 'Should I use 3MF or STL?',
    answer: 'Use 3MF when your slicer reads it: it keeps separate parts and units, and it has room for names and colours. Use STL when a print service or older software asks for it.',
  },
  {
    question: 'Can my slicer open STEP directly?',
    answer: "Bambu Studio, PrusaSlicer and OrcaSlicer can import STEP and mesh it themselves. Converting to 3MF gives you one file that also opens in slicers that can't, with our mesh setting.",
  },
  {
    question: 'Why do round holes look faceted?',
    answer: '3MF stores flat triangles, so every curve becomes a chain of short straight edges. The STEP to STL page explains how to keep holes smooth.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every file is meshed at the same setting: a 0.15 mm chord tolerance and about 29° between neighbouring triangles, the same as our STEP to STL converter. There are no quality presets, and a part that won't mesh at that setting is re-meshed slightly coarser. Need a finer mesh? Export from your CAD program at a smaller deviation.",
  },
  {
    question: 'Do I get a quality report?',
    answer: "Yes. Every conversion comes with a free quality report with 12 checks, including the mesh setting used, the triangle count, a bounding-box match with the STEP, the surface-area ratio, missing area, whether each object is watertight and the number of bodies. If your STEP holds loose surfaces, also check the object list in your slicer: they come through as a separate object that isn't a solid.",
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to 3MF conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_BREP_FAQS = [
  {
    question: 'What is a BREP file?',
    answer: "A .brep (or .brp) file is Open CASCADE's native format for a boundary representation: the exact surfaces, edges and vertices of a shape. FreeCAD, CadQuery, gmsh and other tools built on Open CASCADE read it.",
  },
  {
    question: 'How do I convert a STEP file to BREP?',
    answer: 'Upload your .step or .stp file to the converter at the top of this page and download one BREP file with the exact geometry. FreeCAD, which is free, can also open a STEP and export BREP. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS STEP to BREP converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to BREP?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Does STEP to BREP lose geometry?',
    answer: "No. Solids and surfaces stay exact; nothing is meshed. BREP drops what's around the geometry: part names, colours, the assembly tree and PMI.",
  },
  {
    question: 'What units does the BREP use?',
    answer: 'BREP has no unit field. Our STEP reader works in millimetres, so the coordinates are millimetres.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 11 checks, including the number of solids and faces, whether the solids are closed and whether the volume matches the STEP.',
  },
  {
    question: 'Can SolidWorks or Fusion open a BREP file?',
    answer: "Most commercial CAD programs don't import Open CASCADE .brep files. Send them the STEP instead.",
  },
  {
    question: 'Can I mesh the BREP for FEA?',
    answer: 'Yes. gmsh and Salome open .brep files directly, so you can mesh the exact geometry.',
  },
  {
    question: 'Is .brp the same as .brep?',
    answer: 'Yes. Both extensions are used for the same Open CASCADE format.',
  },
  {
    question: 'Can I convert an assembly?',
    answer: 'Yes. It comes out as one compound shape with every part in its assembled position, without names or the assembly tree.',
  },
  {
    question: 'Can I convert BREP back to STEP?',
    answer: 'Yes. Our BREP to STEP conversion keeps the geometry exact.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to BREP conversion take?',
    answer: 'It depends on the part. Large assemblies can take a while, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_IGES_FAQS = [
  {
    question: 'How do I convert a STEP file to IGES?',
    answer: "Upload your .step or .stp file to the converter at the top of this page and download one IGES file with the exact geometry in millimetres. FreeCAD, which is free, can also open a STEP and export IGES. Marathon OS is the paid route if you don't have CAD at hand: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS STEP to IGES converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to IGES?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'What is the difference between IGS and IGES?',
    answer: 'None. .igs and .iges are two extensions for the same format, and IGES readers accept both.',
  },
  {
    question: 'Will the IGES open as a solid?',
    answer: 'It can. Closed solids are written in IGES B-rep mode (entity type 186) when they pass our read-back check, and programs that read that mode open them as solids. If the check would lose a solid or too many faces, or the STEP holds surfaces, you get trimmed surfaces (type 144) to knit in your CAD program. Open the file to see which you got.',
  },
  {
    question: 'Does STEP to IGES lose geometry?',
    answer: 'No. Curves and surfaces stay exact; nothing is meshed. What our IGES drops is everything around the geometry: part names, colours, the assembly tree and PMI.',
  },
  {
    question: 'What units does the IGES use?',
    answer: 'Millimetres, stored in the file.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 11 checks, including the number of solids and faces, whether the solids are closed and whether the volume matches the STEP.',
  },
  {
    question: 'Should I send a supplier STEP or IGES?',
    answer: "STEP, if they accept it: it's the current standard, and our IGES doesn't carry names, colours or the assembly tree. Send IGES when their CAM or CAD system asks for it.",
  },
  {
    question: 'Can I convert an assembly?',
    answer: 'Yes. Every part comes across in its assembled position, but as one model without the assembly tree or part names.',
  },
  {
    question: 'Can I convert IGES back to STEP?',
    answer: 'Yes. Our IGES to STEP conversion keeps the geometry exact.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to IGES conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_OFF_FAQS = [
  {
    question: 'What is an OFF file?',
    answer: 'OFF (Object File Format) is a plain-text polygon mesh format that came from Geomview. It lists the vertex and face counts, then every vertex, then every face. Geometry libraries such as CGAL and libigl read it, and datasets such as ModelNet use it.',
  },
  {
    question: 'How do I convert a STEP file to OFF?',
    answer: 'Upload your .step or .stp file to the converter at the top of this page and download one OFF mesh in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS STEP to OFF converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to OFF?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Is the OFF file ASCII?',
    answer: 'Yes. OFF is a plain-text format, so you can open it in a text editor or parse it with a few lines of code.',
  },
  {
    question: 'Will it load with my dataset code?',
    answer: 'It uses the standard layout: the OFF header on its own line, then the counts, vertices and triangles. Standard OFF readers, such as those in Open3D, trimesh, libigl and CGAL, read it.',
  },
  {
    question: 'What units is the OFF in?',
    answer: 'Millimetres. OFF has no unit field, so normalise or scale the mesh in your own code if you need a different scale.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every file is meshed at the same setting: a 0.15 mm chord tolerance and about 29° between neighbouring triangles, the same as our STEP to STL converter. There are no quality presets, and a part that won't mesh at that setting is re-meshed slightly coarser. Need a finer mesh? Export from your CAD program at a smaller deviation.",
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including the mesh setting used, the triangle count, a bounding-box match with the STEP, the surface-area ratio, missing area, whether the mesh is watertight and the number of bodies.',
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh without part names.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to OFF conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_PLY_FAQS = [
  {
    question: 'How do I convert a STEP file to PLY?',
    answer: 'Upload your .step or .stp file to the converter at the top of this page and download one binary PLY mesh in millimetres. You can also open the STEP in FreeCAD, which is free, and export PLY there. Marathon OS is the paid route if you only have the STEP: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS STEP to PLY converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STP to PLY?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Is the PLY binary or ASCII?',
    answer: 'Binary, little-endian: the compact form MeshLab, CloudCompare and Open3D read. If you need ASCII, open it in MeshLab and export with Binary encoding turned off.',
  },
  {
    question: 'Does the PLY include colours?',
    answer: "No. It holds vertex positions and triangles, with no colours. STEP colours don't carry over to PLY.",
  },
  {
    question: 'Can I compare my CAD model with a 3D scan?',
    answer: 'Yes. Load the PLY and your scan in CloudCompare, align them and run a cloud-to-mesh distance to see where the scan departs from the CAD.',
  },
  {
    question: 'What units is the PLY in?',
    answer: 'Millimetres. PLY has no unit field, so set the unit or scale in the program you open it in if it expects metres.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every file is meshed at the same setting: a 0.15 mm chord tolerance and about 29° between neighbouring triangles, the same as our STEP to STL converter. There are no quality presets, and a part that won't mesh at that setting is re-meshed slightly coarser. Need a finer mesh? Export from your CAD program at a smaller deviation.",
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including the mesh setting used, the triangle count, a bounding-box match with the STEP, the surface-area ratio, missing area, whether the mesh is watertight and the number of bodies.',
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh without part names.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does a STEP to PLY conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const STEP_TO_STL_FAQS = [
  {
    question: 'How do I convert a STEP file to STL for 3D printing?',
    answer: 'Upload your .step or .stp file to the converter at the top of this page and download one binary STL in millimetres, ready for PrusaSlicer, Bambu Studio, Cura or any other slicer. You can also export STL from your CAD program or from FreeCAD, which is free. Marathon OS is the paid route if you only have the STEP: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS STEP to STL converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download, credits never expire and the quality report is free.',
  },
  {
    question: 'Can I convert STP to STL?',
    answer: 'Yes. .stp is the short extension for STEP; both convert the same way.',
  },
  {
    question: 'Why do round holes come out faceted when I convert STEP to STL?',
    answer: 'STL stores only flat triangles, so every curve becomes a chain of short straight edges. Our converter uses a 0.15 mm chord tolerance; on three public NIST test parts, holes came out with about 25-28 segments and at most 0.087 mm from the STEP. For smoother holes, export from CAD with a 0.01-0.03 mm deviation and a 5-10° angle.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: 'Every file is meshed at the same setting: a 0.15 mm chord tolerance and about 29° between neighbouring triangles. There are no quality presets. Need a finer mesh for resin prints or small holes? Export the STL from your CAD program with the settings in the export guide on this page.',
  },
  {
    question: 'Does converting STEP to STL lose quality?',
    answer: 'STL can only store flat triangles, so curved STEP surfaces become small facets, and STL drops units, colours, part names and feature history. For most FDM prints the facets are smaller than the printer can show. For resin prints or visible curves, export from CAD at a finer deviation. Keep the STEP as your editable master.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'Can I 3D print a STEP file directly?',
    answer: 'Some slicers can. PrusaSlicer, Bambu Studio and OrcaSlicer open STEP files and mesh them on import, where you can set the deflection yourself. Many other slicers, print services and print farms still expect STL.',
  },
  {
    question: 'Why is my STL the wrong size in the slicer?',
    answer: 'STL files do not store units and slicers assume millimetres. If a part is about 25 times too small, it was written in inches: scale it by 2540%. If it is about 25 times too large, scale it by 3.937%. Our STL is always written in millimetres, the unit slicers assume.',
  },
  {
    question: 'Will the STL be watertight?',
    answer: "If the STEP contains valid closed solids, the STL is normally closed too. The free quality report re-reads the STL and tells you whether it's watertight. Your slicer will also show a repair warning if it isn't.",
  },
  {
    question: 'Can I convert a STEP assembly to STL?',
    answer: 'Yes. An assembly comes out as one STL, with every part in its assembled position. Each body stays a separate shell, so you can use Split to objects in your slicer; bodies that touch may split as one object. To print parts separately, you can also export each part from CAD.',
  },
  {
    question: 'Which STEP versions are supported?',
    answer: 'STEP files from any CAD program that writes AP203, AP214 or AP242, as .step or .stp, up to 300 MB. That includes AP242 files that hold only a mesh.',
  },
  {
    question: 'Is the STL binary or ASCII?',
    answer: 'Binary, the compact form every slicer reads. A binary STL is four to five times smaller than the same mesh written as ASCII.',
  },
  {
    question: 'How long does a STEP to STL conversion take?',
    answer: 'It depends on the part. Large assemblies can take several minutes. We email you when the file is ready.',
  },
  {
    question: 'Should I use 3MF instead of STL?',
    answer: '3MF stores units, colours and multiple named objects, and PrusaSlicer, Bambu Studio, OrcaSlicer and Cura all read it. Convert STEP to 3MF when your slicer supports it. STL is still the safest choice when a print service or older software asks for a mesh.',
  },
  {
    question: 'Can I convert STL back to STEP?',
    answer: "Yes, with the STL to STEP converter. It rebuilds flat and cylindrical faces as real CAD surfaces where it can, but it can't recover the original feature history. Keep your original STEP if you will need to edit the design.",
  },
  {
    question: 'Are my STEP files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design.",
  },
];

const STL_TO_STEP_FAQS = [
  {
    question: 'How do I convert STL to STEP?',
    answer: 'Upload the .stl file to the converter at the top of this page, choose the units the model was made in and download the .step file. It opens in SolidWorks, Fusion, Onshape, Inventor and FreeCAD, and it\'s a solid when the rebuild succeeds. You can also convert an STL yourself in FreeCAD, which is free; holes stay faceted there. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Will the STEP file be editable?',
    answer: 'When the rebuild succeeds, yes, as a solid body. You can cut, drill, extrude, shell and measure it with normal CAD tools. Flat areas come back as single faces, and on clean meshes many holes and chamfers are fitted as cylinders and cones. It has no feature history, so you edit the geometry directly instead of changing a dimension in a sketch.',
  },
  {
    question: 'Is the Marathon OS STL to STEP converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert STL to STP?',
    answer: 'Yes. .stp is the short extension for STEP; both are the same ISO 10303 format, and every CAD program that opens one opens the other.',
  },
  {
    question: 'Which STEP version do I get?',
    answer: 'STEP AP214, in millimetres.',
  },
  {
    question: 'Is this an AI STL to STEP converter?',
    answer: 'It doesn\'t use generative AI. The rebuild fits planes, cylinders and cones to the mesh with geometry algorithms, so it never invents detail the STL doesn\'t have.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'Why does the STEP open as surfaces instead of a solid?',
    answer: 'Two possible causes. The STL may not be watertight: holes, gaps or overlapping triangles stop it enclosing a volume. Repair the mesh and convert again. Or, on some very fine or complex meshes, the rebuilt faces don\'t close into a solid. The free quality report\'s Closed solid check tells you which you got.',
  },
  {
    question: 'Why are the holes in my STEP still faceted?',
    answer: 'The rebuild couldn\'t fit a cylinder to that mesh. Holes with more segments in the STL fit better, and a CAD designer can rebuild them exactly.',
  },
  {
    question: 'Which units should I choose?',
    answer: 'The units the model was designed in. STL files do not store units, and models from Printables, Thingiverse, MakerWorld and most slicers are in millimetres. If the part opens about 25 times too small, convert again with inches.',
  },
  {
    question: 'Can I convert a 3D scan or a sculpted model?',
    answer: 'Yes, but scans and organic shapes have few flat or round areas to fit, so they come back made of many small faces. Meshes over 1 million triangles skip the rebuild and come back as up to about 35,000 flat faces, a solid if the mesh is watertight. For engineering use of a scan, having a designer rebuild the part usually gives a better result.',
  },
  {
    question: 'How long does an STL to STEP conversion take?',
    answer: 'It depends on the mesh. Large or dense meshes can take 10 minutes or more, and we email you when the STEP is ready.',
  },
  {
    question: 'Why is the STEP file bigger than the STL?',
    answer: 'A STEP is usually 3 to 6 times the size of the STL, because it stores every face with its edges and vertices. Faceted results are at the larger end.',
  },
  {
    question: 'Which programs can open the STEP file?',
    answer: 'Any program that imports STEP AP214, such as SolidWorks, Fusion, Inventor, Onshape, CATIA, Creo, NX, Solid Edge, FreeCAD and Rhino.',
  },
  {
    question: 'Are my STL files private?',
    answer: 'Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren\'t added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.',
  },
];

const IGES_TO_3DM_FAQS = [
  {
    question: 'How do I convert an IGES file to 3DM?',
    answer: "Upload your .iges or .igs file to the converter at the top of this page and download a Rhino 7 .3dm with the model as one mesh in millimetres. If you have Rhino and need NURBS, open the IGES in Rhino instead; that's free if you already own Rhino. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Will the 3DM have NURBS surfaces?',
    answer: 'No. Our IGES to 3DM conversion writes a triangle mesh, not NURBS. For editable NURBS, open the IGES in Rhino: Rhino imports IGES as NURBS surfaces and polysurfaces.',
  },
  {
    question: 'Can Rhino open IGES files directly?',
    answer: "Yes. Rhino opens and imports .iges and .igs files as NURBS surfaces and polysurfaces. If you have Rhino, that's the better route for geometry you want to edit.",
  },
  {
    question: 'Is the Marathon OS IGES to 3DM converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to 3DM?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Which Rhino versions open the file?',
    answer: "It's a Rhino 7 file, so Rhino 7 and Rhino 8 open it. Rhino 6 and earlier can't open Rhino 7 files.",
  },
  {
    question: 'What units does the 3DM use?',
    answer: "Millimetres, stored as the file's model units. We read the unit stored in the IGES, so an inch file comes out at the right size.",
  },
  {
    question: 'Can I edit the mesh in Rhino?',
    answer: "You can move, scale, cut and join it with Rhino's mesh tools. MeshToNURB turns each triangle into a flat surface, which isn't the same as the original NURBS geometry.",
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh object without part names, layers or colours.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every IGES is meshed at a 1.0 mm chord tolerance and about 29° between neighbouring triangles. On files under 20,000 faces and 200 solids, a part that doesn't come out closed is meshed again finer, down to 0.1 mm. Meshes over 100,000 triangles are reduced to about 100,000, unless that would open the mesh or change its size. There are no quality presets.",
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, mesh uniformity, a bounding-box match with the IGES and how much of the surface the mesh covers. For a surface-only IGES, the solid and watertight checks are marked not applicable.',
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to 3DM conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_3MF_FAQS = [
  {
    question: 'How do I convert an IGES file to 3MF?',
    answer: 'Upload your .iges or .igs file to the converter at the top of this page and download a 3MF with one object per solid, in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS IGES to 3MF converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to 3MF?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Will each part be a separate object?',
    answer: "Yes. Each solid becomes its own object in its assembled position, so you can arrange or assign filaments per part. Parts without solids, such as trimmed surfaces, come through as surface objects, and loose surfaces can each become a separate object.",
  },
  {
    question: 'Will colours carry over?',
    answer: "They can. When the IGES has colours, each part can take its IGES colour as a 3MF display colour, one colour per part, and parts coloured face by face take their first face's colour. Check them in your slicer before you print. If our part-by-part writer can't process the file, you get one uncoloured object named after the file.",
  },
  {
    question: 'Does the 3MF keep units?',
    answer: 'Yes. The 3MF stores millimetres, so slicers open it at the right size. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'Should I use 3MF or STL?',
    answer: 'Use 3MF when your slicer reads it: it keeps separate parts and units, and it has room for names and colours. Use STL when a print service or older software asks for it.',
  },
  {
    question: 'What if my IGES is only surfaces?',
    answer: 'It converts, but the objects are surfaces, not solids, and slicers need closed solids to print. Knit the surfaces into a solid in your CAD program first, or hire a CAD designer to do it.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every part is meshed at a 0.15 mm chord tolerance and about 29° between neighbouring triangles. A part that won't mesh at that setting is re-meshed slightly coarser. There are no quality presets.",
  },
  {
    question: 'Do I get a quality report?',
    answer: "Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, a bounding-box match with the IGES and how much of the surface the mesh covers. If your IGES holds loose surfaces, also check the object list in your slicer: they come through as objects that aren't solids.",
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to 3MF conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_BREP_FAQS = [
  {
    question: 'What is a BREP file?',
    answer: "A .brep (or .brp) file is Open CASCADE's native format for a boundary representation: the exact surfaces, edges and vertices of a shape. FreeCAD, CadQuery, gmsh and other tools built on Open CASCADE read it.",
  },
  {
    question: 'How do I convert an IGES file to BREP?',
    answer: 'Upload your .iges or .igs file to the converter at the top of this page and download one BREP file with the exact geometry. FreeCAD, which is free, can also open an IGES and export BREP. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS IGES to BREP converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to BREP?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Does IGES to BREP lose geometry?',
    answer: "No. Curves and surfaces stay exact; nothing is meshed. BREP drops what's around the geometry: part names, colours, layers and any assembly structure.",
  },
  {
    question: 'Will the BREP be a solid?',
    answer: "If the IGES holds B-rep solids (type 186), the BREP holds solids. If it holds trimmed surfaces (type 144), the BREP holds the same loose faces: we don't sew them.",
  },
  {
    question: 'What units does the BREP use?',
    answer: 'BREP has no unit field. The coordinates are millimetres. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'Can SolidWorks or Fusion open a BREP file?',
    answer: "Most commercial CAD programs don't import Open CASCADE .brep files. Convert IGES to STEP for them instead.",
  },
  {
    question: 'Can I mesh the BREP for FEA?',
    answer: 'Yes. gmsh and Salome open .brep files directly, so you can mesh the exact geometry.',
  },
  {
    question: 'Is .brp the same as .brep?',
    answer: 'Yes. Both extensions are used for the same Open CASCADE format.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 11 checks, including a valid B-rep, the number of solids, a face count match with the IGES, a bounding-box match and whether surface types are preserved.',
  },
  {
    question: 'Can I convert BREP back to IGES?',
    answer: 'Yes. Our BREP to IGES conversion keeps the geometry exact.',
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to BREP conversion take?',
    answer: 'It depends on the file. Large assemblies can take a while, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_OBJ_FAQS = [
  {
    question: 'How do I convert an IGES file to OBJ?',
    answer: "Upload your .iges or .igs file to the converter at the top of this page and download one OBJ mesh in millimetres. FreeCAD, which is free, can also open an IGES and export OBJ. Marathon OS is the paid route if you don't have CAD at hand: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS IGES to OBJ converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to OBJ?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Why is my OBJ 1000 times too big in Blender?',
    answer: "OBJ files don't store units. Ours is written in millimetres, and Blender reads 1 unit as 1 metre. Set Scale to 0.001 in Blender's OBJ importer, or scale the object after import.",
  },
  {
    question: 'Does the OBJ include materials or colours?',
    answer: "No. You get one .obj file with no .mtl material file, so IGES colours don't carry over. Assign materials in your 3D tool after import. If you need separate parts, IGES to 3MF writes one object per solid and can carry a display colour for each.",
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, but the OBJ holds them as one mesh object without part names. In Blender, Separate › By Loose Parts splits it into pieces.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every IGES is meshed at a 1.0 mm chord tolerance and about 29° between neighbouring triangles. On files under 20,000 faces and 200 solids, a part that doesn't come out closed is meshed again finer, down to 0.1 mm. Meshes over 100,000 triangles are reduced to about 100,000, unless that would open the mesh or change its size. There are no quality presets.",
  },
  {
    question: 'Can I get a finer mesh?',
    answer: "Yes, two ways. Export the mesh from your CAD program at a smaller deviation; FreeCAD, which is free, opens IGES files. Or convert IGES to STEP first: our STEP to OBJ converter meshes at a 0.15 mm chord tolerance. That's two conversions.",
  },
  {
    question: 'How do I reduce the triangle count for games or the web?',
    answer: "Meshes over 100,000 triangles are already reduced to about 100,000. To go lower, decimate after import, for example with Blender's Decimate modifier.",
  },
  {
    question: 'What if my IGES is only surfaces?',
    answer: 'It still converts. Trimmed surfaces are meshed and their edges welded, but gaps between surfaces can leave the mesh open. For surface-only files, the quality report marks the solid and watertight checks as not applicable, so check the mesh before you print it.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, mesh uniformity, a bounding-box match with the IGES and how much of the surface the mesh covers. For a surface-only IGES, the solid and watertight checks are marked not applicable.',
  },
  {
    question: 'Can I convert OBJ back to IGES?',
    answer: "Yes. Our OBJ to IGES conversion rebuilds an IGES file from the mesh. Curved areas may stay faceted, and there's no feature tree. Keep your original IGES if you will need the exact geometry.",
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to OBJ conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_OFF_FAQS = [
  {
    question: 'What is an OFF file?',
    answer: 'OFF (Object File Format) is a plain-text polygon mesh format that came from Geomview. It lists the vertex and face counts, then every vertex, then every face. Geometry libraries such as CGAL and libigl read it, and datasets such as ModelNet use it.',
  },
  {
    question: 'How do I convert an IGES file to OFF?',
    answer: 'Upload your .iges or .igs file to the converter at the top of this page and download one OFF mesh in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file.',
  },
  {
    question: 'Is the Marathon OS IGES to OFF converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to OFF?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Is the OFF file ASCII?',
    answer: 'Yes. OFF is a plain-text format, so you can open it in a text editor or parse it with a few lines of code.',
  },
  {
    question: 'Will it load with my dataset code?',
    answer: 'It uses the standard layout: the OFF header on its own line, then the counts, vertices and triangles. Standard OFF readers, such as those in Open3D, trimesh, libigl and CGAL, read it.',
  },
  {
    question: 'What units is the OFF in?',
    answer: 'Millimetres. OFF has no unit field, so normalise or scale the mesh in your own code if you need a different scale. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every IGES is meshed at a 1.0 mm chord tolerance and about 29° between neighbouring triangles. On files under 20,000 faces and 200 solids, a part that doesn't come out closed is meshed again finer, down to 0.1 mm. Meshes over 100,000 triangles are reduced to about 100,000, unless that would open the mesh or change its size. There are no quality presets.",
  },
  {
    question: 'Can I get a finer mesh?',
    answer: "Yes, two ways. Export the mesh from your CAD program at a smaller deviation; FreeCAD, which is free, opens IGES files. Or convert IGES to STEP first: our STEP to OFF converter meshes at a 0.15 mm chord tolerance. That's two conversions.",
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh without part names.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, mesh uniformity, a bounding-box match with the IGES and how much of the surface the mesh covers. For a surface-only IGES, the solid and watertight checks are marked not applicable.',
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to OFF conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_PLY_FAQS = [
  {
    question: 'How do I convert an IGES file to PLY?',
    answer: "Upload your .iges or .igs file to the converter at the top of this page and download one binary PLY mesh in millimetres. FreeCAD, which is free, can also open an IGES and export a mesh. Marathon OS is the paid route if you don't have CAD at hand: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS IGES to PLY converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to PLY?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Is the PLY binary or ASCII?',
    answer: 'Binary, little-endian: the compact form MeshLab, CloudCompare and Open3D read. If you need ASCII, open it in MeshLab and export with Binary encoding turned off.',
  },
  {
    question: 'Does the PLY include colours?',
    answer: "No. IGES colours don't carry over to our PLY.",
  },
  {
    question: 'Can I compare my CAD model with a 3D scan?',
    answer: 'Yes. Load the PLY and your scan in CloudCompare, align them and run a cloud-to-mesh distance to see where the scan departs from the CAD. At our setting, facets on large curves can sit up to about 1 mm from the true surface, so keep that in mind when you read small distances.',
  },
  {
    question: 'What units is the PLY in?',
    answer: 'Millimetres. PLY has no unit field, so set the unit or scale in the program you open it in if it expects metres. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every IGES is meshed at a 1.0 mm chord tolerance and about 29° between neighbouring triangles. On files under 20,000 faces and 200 solids, a part that doesn't come out closed is meshed again finer, down to 0.1 mm. Meshes over 100,000 triangles are reduced to about 100,000, unless that would open the mesh or change its size. There are no quality presets.",
  },
  {
    question: 'Can I get a finer mesh?',
    answer: "Yes, two ways. Export the mesh from your CAD program at a smaller deviation; FreeCAD, which is free, opens IGES files. Or convert IGES to STEP first: our STEP to PLY converter meshes at a 0.15 mm chord tolerance. That's two conversions.",
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh without part names.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, mesh uniformity, a bounding-box match with the IGES and how much of the surface the mesh covers. For a surface-only IGES, the solid and watertight checks are marked not applicable.',
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to PLY conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_STEP_FAQS = [
  {
    question: 'How do I convert an IGES file to STEP?',
    answer: "Upload your .iges or .igs file to the converter at the top of this page and download one STEP file with the exact geometry in millimetres. FreeCAD, which is free, can also open an IGES and export STEP. Marathon OS is the paid route if you don't have CAD at hand: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS IGES to STEP converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to STP?',
    answer: 'Yes. .igs is the short extension for IGES and .stp for STEP; they convert the same way.',
  },
  {
    question: 'Will the STEP be a solid?',
    answer: "If the IGES holds B-rep solids (type 186), they're written as STEP solids. If it holds trimmed surfaces (type 144), the STEP holds the same surfaces: we don't sew them, so knit them in your CAD program. In a file where we rebuild a face whose trim STEP can't store, the faces are written as separate surfaces.",
  },
  {
    question: 'Does IGES to STEP lose geometry?',
    answer: "No. Curves and surfaces stay exact; nothing is meshed. What doesn't carry over is the information around the geometry: part names, colours, layers and any assembly structure.",
  },
  {
    question: 'What units does the STEP use?',
    answer: 'Millimetres. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'Why convert IGES to STEP?',
    answer: 'STEP is the current ISO standard for exchanging exact 3D models, and most CAD programs, suppliers and CAM tools read it. IGES is older, and many IGES files hold only surfaces. Converting gives you the same geometry in the format people ask for.',
  },
  {
    question: 'Can I convert an assembly?',
    answer: 'Yes. Every part comes across in its assembled position, as one model without part names or the assembly tree.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 11 checks, including a valid B-rep, the number of solids, a face count match with the IGES, a bounding-box match and whether surface types are preserved.',
  },
  {
    question: 'Can I convert STEP back to IGES?',
    answer: 'Yes. Our STEP to IGES conversion keeps the geometry exact. Closed solids can be written as IGES B-rep solids; otherwise you get trimmed surfaces.',
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to STEP conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

const IGES_TO_STL_FAQS = [
  {
    question: 'How do I convert an IGES file to STL?',
    answer: "Upload your .iges or .igs file to the converter at the top of this page and download one binary STL in millimetres. FreeCAD, which is free, can also open an IGES and export STL. Marathon OS is the paid route if you don't have CAD at hand: first 2 files free, then {{price}}1 credit per file.",
  },
  {
    question: 'Is the Marathon OS IGES to STL converter free?',
    answer: 'First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire.',
  },
  {
    question: 'Can I convert IGS to STL?',
    answer: 'Yes. .igs is the short extension for IGES; both convert the same way.',
  },
  {
    question: 'Will the STL be watertight?',
    answer: "We work to make it watertight: we weld the edges, close small gaps and, on smaller files, mesh a part again finer when it stays open. The quality report says whether each solid came out watertight. An IGES of loose surfaces can leave gaps we can't close.",
  },
  {
    question: 'Is the STL binary or ASCII?',
    answer: "Binary. It's smaller than ASCII, and every slicer reads it.",
  },
  {
    question: 'What units is the STL in?',
    answer: 'Millimetres. STL has no unit field, and most slicers read STL as millimetres, so the part comes in at the right size. We read the unit stored in the IGES, so an inch file comes out at the right size.',
  },
  {
    question: 'What mesh settings does the converter use?',
    answer: "Every IGES is meshed at a 1.0 mm chord tolerance and about 29° between neighbouring triangles. On files under 20,000 faces and 200 solids, a part that doesn't come out closed is meshed again finer, down to 0.1 mm. Meshes over 100,000 triangles are reduced to about 100,000, unless that would open the mesh or change its size. There are no quality presets.",
  },
  {
    question: 'Can I get a finer mesh?',
    answer: "Yes, two ways. Export the mesh from your CAD program at a smaller deviation; FreeCAD, which is free, opens IGES files. Or convert IGES to STEP first: our STEP to STL converter meshes at a 0.15 mm chord tolerance. That's two conversions.",
  },
  {
    question: 'What if my IGES is only surfaces?',
    answer: 'It still converts. Trimmed surfaces are meshed and their edges welded, but gaps between surfaces can leave the mesh open. For surface-only files, the quality report marks the solid and watertight checks as not applicable, so check the mesh before you print it.',
  },
  {
    question: 'Will the assembly stay in separate parts?',
    answer: 'Every part keeps its assembled position, merged into one mesh without part names.',
  },
  {
    question: 'Do I get a quality report?',
    answer: 'Yes. Every conversion comes with a free quality report with 12 checks, including whether the mesh is watertight, degenerate triangles, mesh uniformity, a bounding-box match with the IGES and how much of the surface the mesh covers. For a surface-only IGES, the solid and watertight checks are marked not applicable.',
  },
  {
    question: 'Can I convert an STL back to IGES?',
    answer: "Yes. Our STL to IGES conversion rebuilds an IGES file from the mesh. Curved areas may stay faceted, and there's no feature tree. Keep your original IGES if you will need the exact geometry.",
  },
  {
    question: 'Which IGES files can I upload?',
    answer: 'IGES files from any CAD program, as .iges or .igs, up to 300 MB. We read both solids (type 186) and trimmed surfaces (type 144). Files that use commas as decimal points, which some SolidWorks setups write, are fixed before reading.',
  },
  {
    question: 'Do I need an account?',
    answer: 'To upload your own file, sign in with Google or an emailed code. The sample file works without signing in.',
  },
  {
    question: 'How long does an IGES to STL conversion take?',
    answer: 'It depends on the file. Large assemblies can take several minutes, and we email you when the file is ready.',
  },
  {
    question: 'Are my IGES files private?',
    answer: "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy.",
  },
];

/** Swap the single-file price token for the live converter price. */
export function withConverterFaqPrice(faqs, priceLabel) {
  const paid = priceLabel ? `${priceLabel} or ` : '';
  return (faqs || []).map((item) => ({
    ...item,
    answer: String(item.answer || '').replaceAll('{{price}}', paid),
  }));
}

/** Format-pair FAQs for /tools/convert-{from}-to-{to} pages (B5.2). Falls back to generic list. */
export function getConverterFaqQuestions(conversionParams) {
  if (!conversionParams) return cadConverterFaqQuestions;

  const pairKey = String(conversionParams).toLowerCase().split('/').filter(Boolean).pop();
  if (pairKey === 'step-to-3dm') return STEP_TO_3DM_FAQS;
  if (pairKey === 'step-to-3mf') return STEP_TO_3MF_FAQS;
  if (pairKey === 'step-to-brep') return STEP_TO_BREP_FAQS;
  if (pairKey === 'step-to-iges') return STEP_TO_IGES_FAQS;
  if (pairKey === 'step-to-off') return STEP_TO_OFF_FAQS;
  if (pairKey === 'step-to-ply') return STEP_TO_PLY_FAQS;
  if (pairKey === 'step-to-stl') return STEP_TO_STL_FAQS;
  if (pairKey === 'stl-to-step') return STL_TO_STEP_FAQS;
  if (pairKey === 'iges-to-3dm') return IGES_TO_3DM_FAQS;
  if (pairKey === 'iges-to-3mf') return IGES_TO_3MF_FAQS;
  if (pairKey === 'iges-to-brep') return IGES_TO_BREP_FAQS;
  if (pairKey === 'iges-to-obj') return IGES_TO_OBJ_FAQS;
  if (pairKey === 'iges-to-off') return IGES_TO_OFF_FAQS;
  if (pairKey === 'iges-to-ply') return IGES_TO_PLY_FAQS;
  if (pairKey === 'iges-to-step') return IGES_TO_STEP_FAQS;
  if (pairKey === 'iges-to-stl') return IGES_TO_STL_FAQS;
  if (THREE_MF_PAIR_FAQS[pairKey]) return THREE_MF_PAIR_FAQS[pairKey];

  const uniquePage = getUniquePairPage(conversionParams);
  if (uniquePage?.faqs?.length) return uniquePage.faqs;

  const { from, to } = parseConversionParams(conversionParams);
  if (!from || !to) return cadConverterFaqQuestions;

  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  const fromExt = getFormatExtensions(from);
  const toExt = getFormatExtensions(to);

  return [
    {
      question: `How do I convert ${fromUpper} to ${toUpper} online?`,
      answer: `Upload your ${fromUpper} file (${fromExt}) to Marathon OS, choose ${toUpper} as the output format, and download the converted file in seconds — no software installation required.`,
    },
    {
      question: `Why convert ${fromUpper} to ${toUpper}?`,
      answer: getWhyConvertAnswer(from, to),
    },
    {
      question: `What ${fromUpper} and ${toUpper} file extensions are supported?`,
      answer: `This converter accepts ${fromExt} input files and outputs ${toExt}. Upload up to 300 MB per file.`,
    },
    {
      question: `Is the ${fromUpper} to ${toUpper} converter free?`,
      answer: `Your first 2 CAD file conversions on Marathon OS are free, any size up to 300 MB. After that, each converted file needs a small fee or 1 credit, paid only when you download it.`,
    },
    {
      question: 'How is my data stored and secured?',
      answer:
        'Your files are encrypted during upload, processed securely in the cloud, and automatically deleted after 7 days.',
    },
    {
      question: 'Do I need any special software or training?',
      answer: `No — upload your ${fromUpper} file and download ${toUpper} directly in your browser. No plugins or desktop CAD tools required.`,
    },
    {
      question: `Can I convert large ${fromUpper} models to ${toUpper}?`,
      answer: `Yes — Marathon OS is optimized for large and complex CAD models. You can upload files up to 300 MB for ${fromUpper} to ${toUpper} conversion.`,
    },
  ];
}

export const cadConverterFaqQuestions = [
  {
    question: 'What is Marathon OS 3D CAD File Converter?',
    answer:
      'A browser-based tool for converting common CAD, mesh, and 2D drawing formats without installing desktop software.',
  },
  {
    question: 'Which file formats are supported?',
    answer:
      'STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), 3DM (.3dm), 3MF (.3mf), DWG (.dwg), and DXF (.dxf).',
  },
  {
    question: 'Is the converter free to use?',
    answer: 'Your first 2 CAD file conversions are free, any size up to 300 MB. After that, each converted file needs a small fee or 1 credit, paid only when you download it.',
  },
  {
    question: 'What is the maximum file size?',
    answer: 'You can upload files up to 300 MB.',
  },
  {
    question: 'How is my data stored and secured?',
    answer:
      'Your files are encrypted during upload, processed securely, and automatically deleted after 7 days.',
  },
  {
    question: 'Do I need any special software or training?',
    answer: 'No—just upload your file and convert it directly in your browser. No downloads or plugins required.',
  },
  {
    question: 'Can I convert large and complex CAD models?',
    answer:
      'Yes—Marathon OS is optimized for large and complex engineering models, with uploads supported up to 300 MB.',
  },
];

export const cadViewerFaqQuestions = [
  {
    question: 'What is a CAD viewer?',
    answer:
      'A CAD viewer lets you open and preview 2D/3D CAD files without editing them—useful for quick reviews and sharing.',
  },
  {
    question: 'Can I open STEP and IGES files online?',
    answer: 'Yes—upload your .step/.stp or .igs/.iges file to preview it directly in your browser.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No. Marathon OS CAD Viewer is browser-based—no downloads required.',
  },
  {
    question: 'Which file formats are supported?',
    answer: 'STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP, 3DM, and 3MF.',
  },
  {
    question: 'Is this CAD viewer free?',
    answer:
      'Yes—this page is presented as a Free Online CAD Viewer, with usage constraints like an upload size limit (up to 300 MB per file).',
  },
  {
    question: 'What is the max file size?',
    answer: 'Up to 300 MB per upload.',
  },
  {
    question: 'Will my file stay private?',
    answer:
      'Files stay private, are encrypted, and are automatically deleted after 7 days; see the Privacy Policy for details.',
  },
  {
    question: 'Why does my model look broken (holes/missing faces)?',
    answer:
      'Some CAD exchange formats (especially surface-based files like IGES) may import with gaps. Try converting to STEP or re-exporting with healed/stitched surfaces.',
  },
  {
    question: 'Can I convert my file to another format?',
    answer: 'Yes—use the 3D File Converter at /tools/3d-cad-file-converter.',
  },
  {
    question: 'Does it work on Mac / Windows?',
    answer:
      'Yes—because it runs in your browser (no installation needed), it works on Mac and Windows with a modern browser.',
  },
];

export function getViewerFaqQuestions(cadType, options = {}) {
  const uniquePage = getUniqueViewerPage(cadType, options);
  if (uniquePage?.faqs?.length) return uniquePage.faqs;
  return cadViewerFaqQuestions;
}
