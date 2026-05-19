'use client';

import React from 'react';
import HowItWorks from '../CadUpload/HowItWorks';
import {
  MdOutlineFileUpload,
  MdOutlineSwapHoriz,
  MdOutlineDownload,
} from 'react-icons/md';

const converterSteps = [
  {
    title: 'Upload your CAD file',
    description: 'Drag & drop or browse to select your file',
    icon: MdOutlineFileUpload,
  },
  {
    title: 'Choose the output format',
    description: 'STEP, IGES, STL, OBJ, PLY, OFF, or BREP',
    icon: MdOutlineSwapHoriz,
  },
  {
    title: 'Convert and download instantly',
    description: 'Download your converted file in one click',
    icon: MdOutlineDownload,
  },
];

/** Client-only: steps include icon components (cannot cross Server → Client boundary). */
export default function CadFileConversionHowItWorks() {
  return (
    <HowItWorks
      variant="cadViewer"
      label="HOW IT WORKS"
      title="How to convert CAD files online"
      mainHeading="No downloads. No plugins. Works right from your browser."
      steps={converterSteps}
      primaryCta={{ label: 'Upload CAD File', href: '/tools/3d-cad-file-converter' }}
      secondaryCta={{ label: 'Open CAD Viewer', href: '/tools/3D-cad-viewer' }}
    />
  );
}
