import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from '../CadHomeDesign/CadViewrTypes.module.css';
import converterStyles from './CadConverterTypes.module.css';

const CONVERSION_TOOLS = [
  {
    from: 'STEP',
    to: 'STL',
    href: '/tools/convert-step-to-stl',
    description: 'For 3D printing and rapid prototyping',
  },
  {
    from: 'STL',
    to: 'STEP',
    href: '/tools/convert-stl-to-step',
    description: 'For reverse engineering workflows',
  },
  {
    from: 'DXF',
    to: 'DWG',
    href: '/tools/convert-dxf-to-dwg',
    description: 'Convert DXF to DWG for 2D CAD exchange.',
  },
  {
    from: 'DWG',
    to: 'DXF',
    href: '/tools/convert-dwg-to-dxf',
    description: 'Convert DWG to DXF for 2D CAD exchange.',
  },
  {
    from: 'STEP',
    to: 'IGES',
    href: '/tools/convert-step-to-iges',
    description: 'For cross-platform CAD exchange',
  },
  {
    from: 'IGES',
    to: 'STEP',
    href: '/tools/convert-iges-to-step',
    description: 'For modern CAD compatibility',
  },
  {
    from: 'OBJ',
    to: 'STL',
    href: '/tools/convert-obj-to-stl',
    description: 'Convert OBJ to STL for mesh workflows and 3D printing.',
  },
  {
    from: 'STL',
    to: 'OBJ',
    href: '/tools/convert-stl-to-obj',
    description: 'For game engines and 3D rendering',
  },
];

function CadConversionToolLinks() {
  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="most-used-cad-conversion-tools">
      <div className={styles.wrapper}>
        <h2 id="most-used-cad-conversion-tools" className={styles.mainHeading}>
          Most Used CAD Conversion Tools
        </h2>
        <div className={styles.grid}>
          {CONVERSION_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={converterStyles.badgeRow}>
                  <span className={converterStyles.pillFrom}>{tool.from}</span>
                  <span className={converterStyles.arrowWrap} aria-hidden>
                    <ArrowRight size={16} strokeWidth={2.5} className={converterStyles.arrowIcon} />
                  </span>
                  <span className={converterStyles.pillTo}>{tool.to}</span>
                </div>
                <p className={styles.cardDescription}>{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadConversionToolLinks;
