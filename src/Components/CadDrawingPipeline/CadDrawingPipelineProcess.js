import styles from "./CadDrawingPipeline.module.css";

const STEPS = [
  {
    num: "01",
    icon: "📤",
    title: "Upload Your CAD File",
    description:
      "Supports STEP (.stp, .step), IGES (.igs), FreeCAD (.FCStd), and most standard CAD formats. Any assembly size.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "AI Analyses the Geometry",
    description:
      "Our AI identifies components, selects the best orthographic views, calculates dimensions, plans section cuts, and generates a bill of materials automatically.",
  },
  {
    num: "03",
    icon: "⬇",
    title: "Download Your Drawing Set",
    description:
      "Receive up to 9 drawing sheets with full dimensions in PDF, SVG, DXF, and PNG formats — ready for manufacturing, inspection, or documentation.",
  },
];

export default function CadDrawingPipelineProcess() {
  return (
    <section className={styles.process} aria-labelledby="cad-pipeline-process-title">
      <p className={styles.processLabel}>Process</p>
      <h2 id="cad-pipeline-process-title" className={styles.processTitle}>
        3 Steps. 4 Minutes. Done.
      </h2>
      <p className={styles.processDesc}>
        No manual drafting. No waiting days for a draftsman. Upload and download.
      </p>

      <div className={styles.processGrid}>
        {STEPS.map((step) => (
          <article key={step.num} className={styles.processCard}>
            <span className={styles.processCardNum} aria-hidden>
              {step.num}
            </span>
            <span className={styles.processCardIcon} aria-hidden>
              {step.icon}
            </span>
            <h3 className={styles.processCardTitle}>{step.title}</h3>
            <p className={styles.processCardText}>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
