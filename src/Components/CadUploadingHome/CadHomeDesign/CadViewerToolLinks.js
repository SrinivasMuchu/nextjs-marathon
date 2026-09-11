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
  {
    label: '3DM File Viewer',
    href: '/tools/3dm-file-viewer',
    pill: '3DM',
    description: 'Preview Rhino 3DM NURBS and mesh models online.',
  },
];

function CadViewerToolLinks({ uniquePage }) {
  const tools = uniquePage?.viewerTools?.length
    ? uniquePage.viewerTools
    : VIEWER_TOOLS;
  const heading = uniquePage?.viewerToolsHeading || 'Most Used CAD Viewer Tools';

  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="most-used-cad-viewer-tools">
      <div className={styles.wrapper}>
        <h2 id="most-used-cad-viewer-tools" className={styles.mainHeading}>
          {heading}
        </h2>
        <div className={styles.grid} data-nosnippet={uniquePage ? true : undefined}>
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.cardContent}>
                {tool.pill ? (
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.formatPill}>{tool.pill}</span>
                    <span className={styles.viewerTitle}>File Viewer</span>
                  </div>
                ) : (
                  <h3 className={styles.viewerTitle}>{tool.title || tool.label}</h3>
                )}
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
