import React from 'react';
import Link from 'next/link';
import styles from './CadViewrTypes.module.css';

const VIEWER_TOOLS = [
  {
    label: 'STEP File Viewer',
    href: '/tools/step-file-viewer',
    pill: 'STEP',
    description: 'Open STEP/STP assemblies and 3D geometry online.',
  },
  {
    label: 'STL File Viewer',
    href: '/tools/stl-file-viewer',
    pill: 'STL',
    description: 'Inspect STL meshes for 3D printing checks.',
  },
  {
    label: 'IGES File Viewer',
    href: '/tools/iges-file-viewer',
    pill: 'IGES',
    description: 'Preview IGES/IGS surfaces before manufacturing handoff.',
  },
  {
    label: 'OBJ File Viewer',
    href: '/tools/obj-file-viewer',
    pill: 'OBJ',
    description: 'View OBJ mesh models and 3D assets in your browser.',
  },
  {
    label: 'PLY File Viewer',
    href: '/tools/ply-file-viewer',
    pill: 'PLY',
    description: 'Open PLY point clouds and polygon meshes online.',
  },
  {
    label: 'OFF File Viewer',
    href: '/tools/off-file-viewer',
    pill: 'OFF',
    description: 'Preview OFF geometry files without desktop software.',
  },
  {
    label: 'BREP File Viewer',
    href: '/tools/brep-file-viewer',
    pill: 'BREP',
    description: 'Open BREP boundary representation models in the browser.',
  },
];

function CadViewerToolLinks() {
  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="most-used-cad-viewer-tools">
      <div className={styles.wrapper}>
        <h2 id="most-used-cad-viewer-tools" className={styles.mainHeading}>
          Most Used CAD Viewer Tools
        </h2>
        <div className={styles.grid}>
          {VIEWER_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeaderRow}>
                  <span className={styles.formatPill}>{tool.pill}</span>
                  <span className={styles.viewerTitle}>File Viewer</span>
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

export default CadViewerToolLinks;
