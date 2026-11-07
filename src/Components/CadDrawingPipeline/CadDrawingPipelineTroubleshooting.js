"use client";

import Link from "next/link";
import styles from "./CadDrawingPipeline.module.css";

const PROBLEMS = [
  {
    icon: "rotate",
    title: "The front view shows the wrong side",
    body: "The front view follows the model's orientation in the STEP file, which may not match how you think of the part.",
    fix: "Fix: rotate the part in CAD so its front faces the front view, re-export the STEP and generate again.",
    link: "Or rearrange views in FreeCAD",
    href: "#how-to-edit",
  },
  {
    icon: "sheet",
    title: "Dimensions overlap or look crowded",
    body: "A detailed part on a small sheet leaves too little room between views.",
    fix: "Fix: generate on A3 or ANSI B instead of A4 or ANSI A.",
    link: "Switch to A3",
    note: "Generate on A3 or ANSI B instead of A4 or ANSI A.",
    toast: "A3 sheet size added to your drawing description.",
  },
  {
    icon: "dots",
    title: "Too many dashed hidden lines",
    body: "Parts with lots of internal features show every hidden edge, which can make views hard to read.",
    fix: "Fix: turn hidden lines off and rely on the section views for internal detail.",
    link: "Turn off hidden lines",
    note: "Turn hidden lines off and rely on section views for internal detail.",
    toast: "Hidden lines off added to your drawing description.",
  },
  {
    icon: "pencil",
    title: "Dimensions are in the wrong units",
    body: "The drawing was generated in millimetres but you work in inches, or the other way round.",
    fix: "Fix: choose the units you need and generate again.",
    link: "Switch to inches",
    note: "Dimension the drawing in inches.",
    toast: "Inches added to your drawing description.",
  },
  {
    icon: "info",
    title: "A feature I need isn't dimensioned",
    body: "Automatic dimensioning covers overall sizes and main features, not every edge or the sizes your design depends on.",
    fix: "Fix: add the missing dimensions in the FreeCAD file or the DXF.",
    link: "How to edit the drawing",
    href: "#how-to-edit",
  },
  {
    icon: "info",
    title: "The upload is rejected",
    body: "The file is over 100 MB, isn't a STEP file, or contains only surfaces with no solid body.",
    fix: "Fix: export the part as a solid in STEP AP214 or AP242. To start from an STL, convert it to STEP first.",
    link: "Convert STL to STEP",
    href: "/tools/convert-stl-to-step",
  },
];

function ProblemIcon({ type }) {
  const common = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };
  if (type === "rotate") {
    return (
      <svg {...common}>
        <path d="M19 12a7 7 0 1 1-2-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M19 4.5V8h-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "sheet") {
    return (
      <svg {...common}>
        <path d="M7 4.5h7.2L18 8.2V19.5H7V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 4.8V8.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "dots") {
    return (
      <svg {...common}>
        <circle cx="6" cy="12" r="1.3" fill="currentColor" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" />
        <circle cx="18" cy="12" r="1.3" fill="currentColor" />
      </svg>
    );
  }
  if (type === "pencil") {
    return (
      <svg {...common}>
        <path d="M14 5.2 18.8 10 9.2 19.6 4.2 20l.4-5L14 5.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

function applyNote(note, message) {
  window.dispatchEvent(new CustomEvent("cad-pipeline-apply", { detail: { note, toast: message } }));
}

export default function CadDrawingPipelineTroubleshooting() {
  return (
    <section className={styles.troubleBand} aria-labelledby="cad-pipeline-trouble-title">
      <div className={styles.troubleInner}>
        <p className={styles.pricingEyebrow}>Common problems</p>
        <h2 id="cad-pipeline-trouble-title" className={styles.troubleTitle}>
          STEP to 2D drawing troubleshooting
        </h2>
        <p className={styles.troubleLede}>
          Most issues come from the model&apos;s orientation, a sheet that&apos;s too small or a complex
          part. Where a setting helps, the link applies it on the generator.
        </p>

        <div className={styles.troubleGrid}>
          {PROBLEMS.map((item) => {
            const action = item.href ? (
              <Link href={item.href}>{item.link}</Link>
            ) : (
              <button
                type="button"
                onClick={() => applyNote(item.note, item.toast)}
              >
                {item.link}
              </button>
            );
            return (
              <article key={item.title} className={styles.troubleCard}>
                <h3>
                  <span className={styles.troubleIcon}>
                    <ProblemIcon type={item.icon} />
                  </span>
                  {item.title}
                </h3>
                <p>{item.body}</p>
                <p className={styles.troubleFix}>{item.fix}</p>
                <p className={styles.troubleAction}>{action}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
