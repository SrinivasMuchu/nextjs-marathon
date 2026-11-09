"use client";

import { useCallback } from "react";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

const STEPS = [
  {
    n: "01",
    title: "Upload the model",
    body: "Choose a .step or .stp file up to 100 MB. A single solid part gives the cleanest drawing.",
  },
  {
    n: "02",
    title: "Choose the standard",
    body: "Pick third-angle or first-angle projection.",
  },
  {
    n: "03",
    title: "Generate",
    body: "Views are projected, laid out, dimensioned and given a title block automatically. Most sets are usually ready in minutes.",
  },
  {
    n: "04",
    title: "Download and review",
    body: "Download every format, check the dimensions you care about, and add tolerances before sending it to a shop.",
  },
];

export default function CadDrawingPipelineSimpleSteps({ initialPrices }) {
  const { totalLabel } = useTechDrawPriceDisplay(initialPrices);
  const price = totalLabel || "";

  const scrollToUpload = useCallback(() => {
    document.getElementById("cad-pipeline-upload")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section className={styles.simpleBand} aria-labelledby="cad-pipeline-simple-title">
      <div className={styles.simpleInner}>
        <p className={styles.pricingEyebrow}>Simple drawing workflow</p>
        <h2 id="cad-pipeline-simple-title" className={styles.simpleTitle}>
          How to convert a STEP file to a 2D drawing
        </h2>
        <p className={styles.simpleLede}>
          Move from a 3D STEP model to a dimensioned drawing set in four steps.
        </p>

        <div className={styles.simpleCallout}>
          <p>
            To make a 2D drawing from a STEP file, upload your .step or .stp model, choose
            third-angle or first-angle projection, then click{" "}
            <strong>Generate 2D drawings</strong>. Usually within minutes you can download a
            dimensioned drawing set as PDF, DXF, SVG and an editable FreeCAD file
            {price ? <>, for {price}</> : null}.
          </p>
        </div>

        <ol className={styles.simpleGrid}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.simpleCard}>
              <span className={styles.simpleNum} aria-hidden>
                {step.n}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <button type="button" className={styles.simpleCta} onClick={scrollToUpload}>
          Generate 2D drawings
        </button>
      </div>
    </section>
  );
}
