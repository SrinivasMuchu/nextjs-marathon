import styles from "./CadDrawingPipeline.module.css";
import { getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";

const { baseLabel: PRICE_LABEL } = getTechDrawPriceDisplay();

const FAQ_ITEMS = [
  {
    question: "What CAD file formats are supported?",
    answer: (
      <p>
        We support all major 3D CAD formats: <strong>STEP (.stp, .step)</strong>,{" "}
        <strong>IGES (.igs, .iges)</strong>, <strong>FreeCAD (.FCStd)</strong>, and most standard
        exchange formats. If you have a proprietary format from SolidWorks, Fusion 360, or CATIA,
        export it as STEP first — it&apos;s the most widely supported format and preserves all
        geometry accurately.
      </p>
    ),
  },
  {
    question: "How accurate are the AI-generated dimensions?",
    answer: (
      <p>
        The dimensions are extracted directly from the 3D geometry, so they reflect the actual model
        measurements accurately. The AI also selects which dimensions are most critical for
        manufacturing. However,{" "}
        <strong>
          we always recommend verifying dimensions against your original model
        </strong>{" "}
        before sending to manufacture — especially for tight tolerances or safety-critical parts.
      </p>
    ),
  },
  {
    question: "What does the pipeline actually do in 4 minutes?",
    answer: (
      <p>
        After uploading, our system: (1) <strong>renders 6 standard views</strong> of your model
        (front, back, top, bottom, left, right, isometric, with hidden lines); (2){" "}
        <strong>sends these for AI analysis</strong> which reviews the geometry and writes a complete
        drawing plan including view selection, section cuts, and dimension placement; (3){" "}
        <strong>drives FreeCAD TechDraw</strong> to generate all sheets per the AI&apos;s plan; and
        (4) <strong>exports all formats</strong> simultaneously. You receive a download link when
        complete.
      </p>
    ),
  },
  {
    question: "Are these drawings suitable for manufacturing?",
    answer: (
      <p>
        The drawings follow standard engineering drawing conventions (ISO / ASME) and include title
        blocks, projection symbols, and tolerances. They are suitable as{" "}
        <strong>a starting point for manufacturing documentation</strong>. For aerospace, medical,
        or regulated industries, a qualified draftsperson should review and sign off on the
        drawings before use in production.
      </p>
    ),
  },
  {
    question: `Why is it ${PRICE_LABEL}? How does that compare to hiring a draftsperson?`,
    answer: (
      <p>
        A professional draftsperson typically charges <strong>$50–$150/hour</strong> and a
        multi-sheet drawing set can take 4–8 hours, costing $200–$1,200. Our pipeline delivers an
        equivalent first draft in 4 minutes for {PRICE_LABEL} — a <strong>50–300× cost reduction</strong>. Use
        the time saved to focus on design iteration and engineering decisions rather than manual
        drafting.
      </p>
    ),
  },
  {
    question: 'What is included in a "drawing set"?',
    answer: (
      <p>
        Each {PRICE_LABEL} drawing set includes: <strong>up to 9 sheets</strong> covering orthographic views
        (front, top, side), isometric view, section views (typically 2 cuts), detail views of
        critical features, and a bill of materials sheet. All sheets are delivered in PDF, SVG, DXF,
        and high-resolution PNG formats — that&apos;s up to 36 files in total.
      </p>
    ),
  },
  {
    question: "Can I use the drawings commercially?",
    answer: (
      <p>
        Yes. You own the output drawings. They are generated from your input file and you hold full
        rights to use them for manufacturing, documentation, client deliverables, or resale. We do
        not retain rights to the drawings or your uploaded CAD files.
      </p>
    ),
  },
  {
    question: "What is the 15,000+ drawing library on this page?",
    answer: (
      <p>
        We have processed over 15,000 CAD files from our existing design database through this
        pipeline. The library shows the range and quality of output across different part types —
        from vehicle chassis and mechanical assemblies to complex custom geometries. These are
        available to browse as reference examples. To generate drawings from{" "}
        <em>your own</em> CAD files, use the paid pipeline above.
      </p>
    ),
  },
  {
    question: "Is my CAD file kept private?",
    answer: (
      <p>
        Your uploaded CAD files are processed in an isolated environment and are{" "}
        <strong>not shared, trained on, or retained</strong> after processing. Files are
        automatically deleted within 24 hours of processing. We do not use your proprietary
        geometry for any purpose other than generating your requested drawings.
      </p>
    ),
  },
];

/**
 * FAQ — all Q&A always visible (no accordion, no close).
 */
export default function CadDrawingPipelineFaq() {
  return (
    <section
      id="faq"
      className={styles.pipelineFaq}
      aria-labelledby="cad-pipeline-faq-title"
    >
      <p className={styles.pipelineFaqLabel}>FAQ</p>
      <h2 id="cad-pipeline-faq-title" className={styles.pipelineFaqTitle}>
        Frequently Asked Questions
      </h2>

      <ul className={styles.pipelineFaqList}>
        {FAQ_ITEMS.map((item) => (
          <li key={item.question}>
            <article className={styles.pipelineFaqItem}>
              <h3 className={styles.pipelineFaqQuestion}>{item.question}</h3>
              <div className={styles.pipelineFaqAnswer}>{item.answer}</div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
