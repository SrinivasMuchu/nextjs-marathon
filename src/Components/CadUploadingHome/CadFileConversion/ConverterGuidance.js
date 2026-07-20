import React from 'react';
import { CircleAlert, Check } from 'lucide-react';
import styles from './ConverterGuidance.module.css';

const QUALITY_NOTES = [
  {
    title: 'CAD → Mesh',
    description:
      'STEP, IGES or BREP to STL, OBJ, PLY or 3DM may lose parametric features because the output becomes triangles or polygons.',
  },
  {
    title: 'Mesh → CAD',
    description:
      'STL, OBJ or PLY to STEP, IGES or BREP may create reconstructed surfaces or approximations, depending on the engine and model quality.',
  },
  {
    title: 'Broken output',
    description:
      'If the target file looks incorrect, try converting to STEP first and then convert STEP to the final format.',
  },
];

const USE_CASES = [
  { title: '3D printing', description: 'Turn CAD or mesh files into slicer-compatible formats.' },
  { title: 'Supplier handoff', description: 'Send a file format your manufacturer or vendor can open.' },
  { title: 'CAD review', description: 'Prepare models for browser preview, markup or design review.' },
  { title: 'Prototyping', description: 'Move between engineering and mesh formats during iteration.' },
  { title: 'Design collaboration', description: 'Exchange files between Rhino, CAD, render and scan tools.' },
  { title: 'Legacy migration', description: 'Convert older IGES or DXF files into modern workflows.' },
];

function ConverterGuidance() {
  return (
    <section className={styles.section} aria-label="CAD conversion guidance">
      <div className={styles.inner}>
        <article className={styles.panel}>
          <p className={styles.eyebrow}>Read before converting</p>
          <h2>Conversion quality notes</h2>
          <div className={styles.qualityList}>
            {QUALITY_NOTES.map((note) => (
              <div key={note.title} className={styles.qualityItem}>
                <span className={styles.warningIcon} aria-hidden>
                  <CircleAlert size={15} strokeWidth={2} />
                </span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <p className={styles.eyebrow}>When to use it</p>
          <h2>Built for real engineering handoffs</h2>
          <div className={styles.useGrid}>
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className={styles.useItem}>
                <span className={styles.checkIcon} aria-hidden>
                  <Check size={14} strokeWidth={2.3} />
                </span>
                <div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ConverterGuidance;
