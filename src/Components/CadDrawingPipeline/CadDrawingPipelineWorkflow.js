import Link from "next/link";
import styles from "./CadDrawingPipeline.module.css";

const STEPS = [
  {
    title: "Check the source STEP",
    body: "Confirm orientation, bodies and scale before you generate drawings.",
    cta: "Open STEP viewer",
    href: "/tools/step-file-viewer",
    icon: "eye",
  },
  {
    title: "Edit the drawing",
    body: "Move views, add dimensions and update the title block in FreeCAD or the DXF.",
    cta: "How to edit",
    href: "#how-to-edit",
    icon: "sheet",
  },
  {
    title: "Need a production drawing?",
    body: "A CAD designer adds tolerances, GD&T, threads and finish notes for machining.",
    cta: "Hire a CAD designer",
    href: "/cad-services",
    icon: "headset",
  },
];

function StepIcon({ type }) {
  const common = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };
  if (type === "eye") {
    return (
      <svg {...common}>
        <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  }
  if (type === "sheet") {
    return (
      <svg {...common}>
        <path d="M7 3.5h7.2L19 8.2V20.5H7V3.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M14 3.8V8.4h4.4M9.5 12.5h6M9.5 16h4.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4.5 13.5v1.2a3.2 3.2 0 0 0 3.2 3.2h.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M19.5 13.5v1.2a3.2 3.2 0 0 1-3.2 3.2h-.4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M4.5 12.2V10a7.5 7.5 0 0 1 15 0v2.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8.2 18.2c.6 1.3 1.8 2.1 3.8 2.1s3.2-.8 3.8-2.1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export default function CadDrawingPipelineWorkflow() {
  return (
    <section className={styles.workflowBand} aria-labelledby="cad-pipeline-workflow-title">
      <div className={styles.workflowPanel}>
        <p className={styles.pricingEyebrow}>Continue your CAD workflow</p>
        <div className={styles.workflowHead}>
          <h2 id="cad-pipeline-workflow-title" className={styles.workflowTitle}>
            Check the STEP, edit the drawing or get a production drawing
          </h2>
          <p className={styles.workflowIntro}>
            Inspect the source model before generating, refine the drawing in FreeCAD or 2D CAD, and
            bring in a designer when the part needs tolerances and GD&amp;T.
          </p>
        </div>

        <div className={styles.workflowGrid}>
          {STEPS.map((step) => (
            <Link key={step.title} href={step.href} className={styles.workflowCard}>
              <span className={styles.workflowIcon}>
                <StepIcon type={step.icon} />
              </span>
              <span className={styles.workflowCopy}>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
                <em>{step.cta}</em>
              </span>
              <span className={styles.workflowArrow} aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 6.5 15 12l-6 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
