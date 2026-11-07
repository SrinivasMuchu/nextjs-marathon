import styles from "./CadDrawingPipeline.module.css";

const REASONS = [
  {
    title: "No CAD software",
    body: "Generate drawings in your browser without SolidWorks, Fusion or a drafting plugin.",
    icon: "download",
  },
  {
    title: "From exact STEP geometry",
    body: "Views and dimensions come from the solid model itself, not from a mesh or screenshot.",
    icon: "cube",
  },
  {
    title: "Ready to edit",
    body: "Every set includes a FreeCAD file and a DXF, so you can add tolerances and notes.",
    icon: "pencil",
  },
  {
    title: "Private file handling",
    body: "Uploads stay out of the public CAD library and are deleted within 7 days.",
    icon: "lock",
  },
];

function ReasonIcon({ type }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };
  if (type === "download") {
    return (
      <svg {...common}>
        <path d="M12 4v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="m8 11 4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "cube") {
    return (
      <svg {...common}>
        <path d="m12 3.5 7 3.8v7.4l-7 3.8-7-3.8V7.3l7-3.8Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M12 11.2 19 7.4M12 11.2 5 7.4M12 11.2V18.5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "pencil") {
    return (
      <svg {...common}>
        <path d="M14.2 5.2 18.8 9.8 9.2 19.4 4.2 19.8 4.6 14.8 14.2 5.2Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="m12.6 6.8 4.6 4.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="10.5" width="12" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export default function CadDrawingPipelineReasons() {
  return (
    <section className={styles.reasonBand} aria-label="What the drawing set includes">
      <ul className={styles.reasonGrid}>
        {REASONS.map((item) => (
          <li key={item.title} className={styles.reasonCard}>
            <span className={styles.reasonIcon}>
              <ReasonIcon type={item.icon} />
            </span>
            <h3 className={styles.reasonTitle}>{item.title}</h3>
            <p className={styles.reasonBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
