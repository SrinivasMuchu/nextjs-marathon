import Link from "next/link";
import styles from "./CadDrawingPipeline.module.css";

const STEPS = [
  {
    n: "01",
    title: "Read the STEP",
    body: "Solids, units and orientation are loaded from the file exactly as they were exported.",
  },
  {
    n: "02",
    title: "Project the views",
    body: "Front, top and side views are projected with hidden-line removal, in the projection you chose.",
  },
  {
    n: "03",
    title: "Lay out the sheet",
    body: "Views are scaled to a standard scale and arranged on an A0 sheet with the title block.",
  },
  {
    n: "04",
    title: "Dimension and section",
    body: "Overall sizes and main features are dimensioned, and section views are added through internal features.",
  },
  {
    n: "05",
    title: "Export",
    body: "The sheet is written to PDF, DXF and SVG, and saved as an editable FreeCAD file.",
  },
  {
    n: "06",
    title: "Delete the files",
    body: "Your drawings stay available to download for 7 days.",
  },
];

export default function CadDrawingPipelineUnderTheHood() {
  return (
    <section className={styles.hoodBand} aria-labelledby="cad-pipeline-hood-title">
      <div className={styles.hoodLayout}>
        <div>
          <p className={styles.pricingEyebrow}>Under the hood</p>
          <h2 id="cad-pipeline-hood-title" className={styles.hoodTitle}>
            How the drawing pipeline works
          </h2>
          <p className={styles.hoodLede}>
            Drawings are created from the exact solid geometry in your STEP file, not from a mesh or
            a screenshot, so every line and dimension comes from the real model.
          </p>
          <Link className={styles.hoodLink} href="/about-us">
            Read about the Marathon OS engineering team
          </Link>
        </div>

        <ol className={styles.hoodList}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.hoodCard}>
              <span className={styles.hoodNum}>{step.n}</span>
              <span>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
