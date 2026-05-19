/**
 * CAD tool FAQ content (converter + viewer). Import from Server or Client components.
 * Edit this file to change questions/answers sitewide for those pages.
 */

export const cadConverterFaqQuestions = [
  {
    question: 'What is Marathon OS 3D CAD File Converter?',
    answer:
      'Marathon OS 3D File Converter is a browser-based tool that lets you convert CAD/3D file formats online—no software installation needed.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), DWG (.dwg), DXF (.dxf).',
  },
  {
    question: 'Is Marathon OS 3D File Converter free to use?',
    answer: 'Yes! It’s completely free with no usage limits or hidden costs. Just drag, drop, and convert.',
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
