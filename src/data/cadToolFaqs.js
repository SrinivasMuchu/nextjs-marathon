/**
 * CAD tool FAQ content (converter + viewer). Import from Server or Client components.
 * Edit this file to change questions/answers sitewide for those pages.
 */

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
  dwg: '.dwg',
  dxf: '.dxf',
  '3dm': '.3dm',
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
  '3dm-step': '3DM is Rhino’s native format. Converting 3DM to STEP makes your NURBS model usable in mainstream CAD and manufacturing workflows.',
  'step-3dm': 'Converting STEP to 3DM lets you bring solid CAD models into Rhino for surface modeling, design iteration, and NURBS editing.',
  '3dm-stl': 'Converting 3DM to STL creates a mesh ready for 3D printing and slicer software from a Rhino model.',
  'stl-3dm': 'Converting STL to 3DM helps bring mesh geometry into Rhino for further modeling and cleanup.',
};

function getWhyConvertAnswer(from, to) {
  const key = `${from}-${to}`.toLowerCase();
  if (WHY_CONVERT_HINTS[key]) return WHY_CONVERT_HINTS[key];
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  return `Converting ${fromUpper} to ${toUpper} helps you move CAD data between tools, suppliers, and workflows without installing desktop software. Marathon OS handles the conversion in the cloud so you can download a ${toUpper} file in seconds.`;
}

/** Format-pair FAQs for /tools/convert-{from}-to-{to} pages (B5.2). Falls back to generic list. */
export function getConverterFaqQuestions(conversionParams) {
  if (!conversionParams) return cadConverterFaqQuestions;

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
      answer: `Files under 5 MB are free to convert and download on Marathon OS. Larger files may require a small fee per conversion.`,
    },
    {
      question: 'How is my data stored and secured?',
      answer:
        'Your files are encrypted during upload, processed securely in the cloud, and automatically deleted after 24 hours.',
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
      'Marathon OS 3D File Converter is a browser-based tool that lets you convert CAD/3D file formats online—no software installation needed.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), 3DM (.3dm), DWG (.dwg), DXF (.dxf).',
  },
  {
    question: 'Is Marathon OS 3D File Converter free to use?',
    answer: 'Files under 5 MB are free to convert and download. Larger files may require a small fee per conversion.',
  },
  {
    question: 'How is my data stored and secured?',
    answer:
      'Your files are encrypted during upload, processed securely, and automatically deleted after 24 hours.',
  },
  {
    question: 'Do I need any special software or training?',
    answer: 'No—just upload your file and convert it directly in your browser (no downloads/plugins).',
  },
  {
    question: 'Can I convert large and complex CAD models?',
    answer:
      "Yes—the page states it's optimized to handle large & complex models, and supports uploads up to 300 MB.",
  },
  {
    question: 'What is the max file size?',
    answer: 'You can upload files up to 300 MB.',
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
    answer: 'STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP.',
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
      'Files stay private, are encrypted, and are automatically deleted after 24 hours; see the Privacy Policy for details.',
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
