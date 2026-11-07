"use client";

import Link from "next/link";
import styles from "./CadDrawingPipeline.module.css";

const TOOLS = [
  {
    chips: ["STEP"],
    title: "STEP viewer",
    body: "Check orientation and bodies before generating drawings",
    href: "/tools/step-file-viewer",
  },
  {
    chips: ["STEP", "BOM"],
    title: "STEP BOM extractor",
    body: "List every part in an assembly",
    href: "/tools/step-bom-extractor",
  },
  {
    chips: ["STEP", "STL"],
    title: "STEP to STL",
    body: "Mesh for 3D printing",
    href: "/tools/convert-step-to-stl",
  },
  {
    chips: ["STL", "STEP"],
    title: "STL to STEP",
    body: "Turn a mesh into a solid before drawing it",
    href: "/tools/convert-stl-to-step",
  },
  {
    chips: ["DWG", "DXF"],
    title: "DWG to DXF",
    body: "Exchange 2D drawings between CAD programs",
    href: "/tools/convert-dwg-to-dxf",
  },
  {
    chips: ["CAD"],
    title: "Production drawings",
    body: "Tolerances, GD&T and notes by a designer",
    href: "/cad-services",
  },
];

function scrollToUpload() {
  document.getElementById("cad-pipeline-upload")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function CadDrawingPipelineMoreTools() {
  return (
    <section className={styles.moreBand} aria-labelledby="cad-pipeline-more-title">
      <div className={styles.moreInner}>
        <h2 id="cad-pipeline-more-title" className={styles.moreTitle}>
          More STEP tools
        </h2>
        <p className={styles.moreLede}>
          Inspect the model before drawing it, or convert it for the next step.
        </p>

        <div className={styles.moreGrid}>
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.moreCard}>
              <span className={styles.moreChips}>
                {tool.chips.map((chip, index) => (
                  <span key={chip} className={styles.moreChipWrap}>
                    {index > 0 ? <span className={styles.moreArrow} aria-hidden="true">→</span> : null}
                    <span className={styles.moreChip}>{chip}</span>
                  </span>
                ))}
              </span>
              <strong>{tool.title}</strong>
              <span>{tool.body}</span>
            </Link>
          ))}
        </div>

        <div className={styles.quotePanel}>
          <h2 id="cad-pipeline-quote-title">
            Need a drawing a machinist can quote and inspect against?
          </h2>
          <p>
            Start with an automated drawing set, or have a CAD designer prepare a production
            drawing with tolerances, GD&amp;T and your company title block.
          </p>
          <div className={styles.quoteActions}>
            <button type="button" onClick={scrollToUpload}>
              Generate 2D drawings
            </button>
            <Link href="/cad-services">Get a production drawing</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
