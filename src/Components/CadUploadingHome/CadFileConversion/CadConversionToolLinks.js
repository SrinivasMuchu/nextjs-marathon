import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './CadConversionToolLinks.module.css';

const CONVERSION_TOOLS = [
  {
    from: 'STEP',
    to: 'STL',
    href: '/tools/convert-step-to-stl',
    description: 'For 3D printing and rapid prototyping',
  },
  {
    from: 'STEP',
    to: '3DM',
    href: '/tools/convert-step-to-3dm',
    description: 'For Rhino / OpenNURBS workflows',
  },
  {
    from: '3DM',
    to: 'STEP',
    href: '/tools/convert-3dm-to-step',
    description: 'Move Rhino models into CAD/CAM',
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
    <section className={styles.section} aria-labelledby="most-used-cad-conversion-tools">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Most used CAD workflows</p>
          <h2 id="most-used-cad-conversion-tools" className={styles.mainHeading}>
            Start with a popular conversion
          </h2>
          <p className={styles.intro}>
            Jump directly into the format pair used most often for printing, CAD exchange, Rhino,
            mesh editing and 2D drawing workflows.
          </p>
        </header>
        <div className={styles.grid}>
          {CONVERSION_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.formatPair} aria-hidden>
                <span className={styles.formatBadge}>{tool.from}</span>
                <ArrowRight size={14} strokeWidth={2} className={styles.pairArrow} />
                <span className={`${styles.formatBadge} ${styles.formatBadgeTo}`}>{tool.to}</span>
              </div>
              <div className={styles.cardContent}>
                <h3>{tool.from} to {tool.to}</h3>
                <p className={styles.cardDescription}>{tool.description}</p>
              </div>
              <span className={styles.openIcon} aria-hidden>
                <ArrowRight size={17} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadConversionToolLinks;
