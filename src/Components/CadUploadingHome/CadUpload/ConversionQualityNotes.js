import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ConversionQualityNotes.module.css';

const bullets = [
  <>
    <strong>CAD → Mesh</strong> (STEP/IGES/BREP → STL/OBJ/PLY): may lose parametric features; output becomes triangles.
  </>,
  <>
    <strong>Mesh → CAD</strong> (STL/OBJ/PLY → STEP/IGES/BREP): may produce surfaces/approximations depending on engine.
  </>,
  <>If output looks broken, try converting to <strong>STEP</strong> first, then to your target format.</>,
];

function ConversionQualityNotes() {
  return (
    <section className={styles.band} aria-labelledby="conversion-quality-notes-heading">
      <div className={styles.calloutHeader}>
        <span className={styles.iconWrap} aria-hidden>
          <AlertTriangle size={22} strokeWidth={2.2} />
        </span>
        <h3 id="conversion-quality-notes-heading" className={styles.title}>
          Conversion quality notes (read before converting)
        </h3>
      </div>
      <ul className={styles.list}>
        {bullets.map((content, index) => (
          <li key={index} className={styles.listItem}>
            {content}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ConversionQualityNotes;
