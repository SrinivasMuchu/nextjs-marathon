'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoPopUp from '@/Components/HomePages/RequestDemo/DemoPopUp';
import styles from './IndustryFinalCtaBand.module.css';

const VIEWER_HREF = '/tools/3D-cad-viewer';

/**
 * Final CTA band: upload + request demo (Section “Final CTA”).
 */
function IndustryFinalCtaBand({ industryName }) {
  const [openDemoForm, setOpenDemoForm] = useState(null);
  const industry = (industryName && String(industryName).trim()) || 'your industry';
  const industryLower = industry.toLowerCase();

  return (
    <section className={styles.section} aria-labelledby="industry-final-cta-title">
      {openDemoForm === 'demo' && (
        <DemoPopUp
          onclose={() => setOpenDemoForm(null)}
          openPopUp={openDemoForm}
          setOpenDemoForm={setOpenDemoForm}
        />
      )}
      <div className={styles.inner}>
        <h2 id="industry-final-cta-title" className={styles.title}>
          Review {industryLower} CAD files online without installing CAD software
        </h2>
        <p className={styles.desc}>
          Open CAD files in your browser, inspect 3D geometry quickly, and give every stakeholder easier
          access to the models they need.
        </p>
        <div className={styles.row}>
          <Link href={VIEWER_HREF} className={styles.primary}>
            Upload CAD File
          </Link>
          <button type="button" className={styles.secondary} onClick={() => setOpenDemoForm('demo')}>
            Request Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default IndustryFinalCtaBand;
