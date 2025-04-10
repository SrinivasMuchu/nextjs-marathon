import React from 'react'
import styles from './IndustryDesign.module.css'

function AboutCad() {
  const sections = Array.from({ length: 6 }).map((_, index) => ({
    title: `Title ${index + 1}`,
    rows: Array.from({ length: 4 }).map(() => ['key', 'value']),
  }));

  return (
    <div className={styles['industry-design-about-cad']}>
      <div className={styles['industry-design-about-cad']}>
        <h2>About CAD</h2>
        <p>
          Computer-Aided Design (CAD) is a technology used for creating precision drawings or
          technical illustrations in 2D and 3D. It is widely used in various industries, including
          engineering, architecture, and manufacturing.
        </p>
      </div>
      <div className={styles['industry-design-about-cad-details']}>
        {sections.map((section, i) => (
          <div key={i}  className={styles['industry-design-about-cad-sub-content']}>
            <span className={styles['industry-design-about-cad-sub-head']}>{section.title}</span>
            {section.rows.map((pair, j) => (
              <div key={j} className={styles['industry-design-about-cad-sub-details']}>
                <span>{pair[0]}</span>
                <span>{pair[1]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutCad;
