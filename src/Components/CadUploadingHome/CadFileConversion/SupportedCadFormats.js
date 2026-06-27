import React from 'react';
import styles from './CadConverterSections.module.css';

const FORMATS = ['STEP', 'STL', 'IGES', 'OBJ', 'PLY', 'BREP', 'DWG', 'DXF'];

function SupportedCadFormats() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="supported-cad-formats">
      <div className={styles.inner}>
        <h2 id="supported-cad-formats" className={styles.heading}>
          Supported CAD and 3D Formats
        </h2>
        <ul className={styles.formatList}>
          {FORMATS.map((format) => (
            <li key={format} className={styles.formatPill}>
              {format}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SupportedCadFormats;
