import React from 'react';
import styles from './ConversionQualityNotes.module.css';

const notes = [
  <><strong>CAD → Mesh</strong> (STEP/IGES/BREP → STL/OBJ/PLY): may lose <strong>parametric features</strong>; output becomes <strong>triangles</strong>.</>,
  <><strong>Mesh → CAD</strong> (STL/OBJ/PLY → STEP/IGES/BREP): may produce <strong>surfaces/approximations</strong> (depends on engine).</>,
  <>If output looks &quot;broken&quot; , try converting to <strong>STEP</strong> first, then to <strong>target format</strong>.</>,
];

function ConversionQualityNotes() {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Conversion quality notes (read before converting)</h3>
        <div className={styles.notesList}>
          {notes.map((content, index) => (
            <div key={index} className={styles.noteCard}>
              <p className={styles.noteText}>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ConversionQualityNotes;
