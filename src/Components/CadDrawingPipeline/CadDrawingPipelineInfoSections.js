import React from 'react';
import Link from 'next/link';
import { CAD_DRAWING_PIPELINE_INTERNAL_LINKS } from '@/data/cadDrawingPipelinePage';
import styles from './CadDrawingPipeline.module.css';

const INPUT_FILES = ['STEP (.step, .stp)', 'IGES (.igs, .iges)', 'FreeCAD (.FCStd)'];

const OUTPUT_FILES = [
  'PDF drawing sheets',
  'SVG drawing sheets',
  'DXF drawing files',
  'PNG previews',
  'Editable FreeCAD file where available',
];

const GENERATOR_CREATES = [
  'Orthographic views',
  'Top, front and side views',
  'Section cuts',
  'Detail views',
  'Sheet labels',
  'Basic dimensions where available',
  'Bill of materials where available',
  'Downloadable drawing files',
];

function ItemList({ items }) {
  return (
    <ul className={styles.infoList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function CadDrawingPipelineInfoSections() {
  return (
    <>
      <section className={styles.infoSection} aria-labelledby="supported-input-files">
        <p className={styles.infoSectionLabel}>Input files</p>
        <h2 id="supported-input-files" className={styles.infoSectionTitle}>
          Supported input files
        </h2>
        <ItemList items={INPUT_FILES} />
      </section>

      <section className={`${styles.infoSection} ${styles.infoSectionAlt}`} aria-labelledby="output-files-included">
        <p className={styles.infoSectionLabel}>Deliverables</p>
        <h2 id="output-files-included" className={styles.infoSectionTitle}>
          Output files included
        </h2>
        <ItemList items={OUTPUT_FILES} />
      </section>

      <section className={styles.infoSection} aria-labelledby="what-generator-creates">
        <p className={styles.infoSectionLabel}>Drawing set</p>
        <h2 id="what-generator-creates" className={styles.infoSectionTitle}>
          What the drawing generator creates
        </h2>
        <ItemList items={GENERATOR_CREATES} />
      </section>

      <section className={`${styles.infoSection} ${styles.infoSectionAlt}`} aria-labelledby="before-using-drawings">
        <p className={styles.infoSectionLabel}>Review</p>
        <h2 id="before-using-drawings" className={styles.infoSectionTitle}>
          Before using generated drawings
        </h2>
        <p className={styles.infoSectionCopy}>
          Review critical dimensions against the original CAD model before using the generated
          drawings for manufacturing. Generated drawings should be checked by an engineer or
          designer before production release.
        </p>
      </section>

      <section className={styles.infoSection} aria-labelledby="cad-pipeline-internal-links">
        <p className={styles.infoSectionLabel}>Explore Marathon OS</p>
        <h2 id="cad-pipeline-internal-links" className={styles.infoSectionTitle}>
          Related tools and resources
        </h2>
        <div className={styles.infoLinkGrid}>
          {CAD_DRAWING_PIPELINE_INTERNAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.infoLink}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
