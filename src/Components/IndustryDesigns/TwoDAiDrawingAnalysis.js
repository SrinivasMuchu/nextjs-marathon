import styles from "./TwoDAiDrawingAnalysis.module.css";

/**
 * Server component: AI drawing analysis section heading (view cards follow below).
 */
export default function TwoDAiDrawingAnalysis() {
  return (
    <section className={styles.section} aria-labelledby="ai-drawing-analysis-heading">
      <p className={styles.eyebrow}>AI Drawing Analysis</p>
      <h2 id="ai-drawing-analysis-heading" className={styles.title}>
        What the AI Decided &amp; Why
      </h2>
      <p className={styles.lead}>
        The cards below explain how the generated drawing outputs and assets connect
        to the final technical sheets.
      </p>
    </section>
  );
}
