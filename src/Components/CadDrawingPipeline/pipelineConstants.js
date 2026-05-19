import styles from "./CadDrawingPipeline.module.css";

export const STEP_EXT = /\.(step|stp)$/i;

/** Prefer user title, then STEP filename without extension. */
export function getJobDisplayTitle(job, fallback = "Technical drawing") {
  const title = (job?.title || "").trim();
  if (title) return title;
  const file = (job?.file_name || "").trim();
  if (file) return file.replace(/\.(step|stp)$/i, "");
  return fallback;
}

/** Subtitle under the page heading (no job id). */
export function getJobPageSubtitle(job) {
  const description = (job?.description || "").trim();
  if (description) return description;
  const file = (job?.file_name || "").trim();
  if (file) return `Source file: ${file}`;
  return "Stages update automatically while your drawing is processed on the server.";
}

export const PIPELINE_STAGES_UI = [
  {
    name: "Stage 1 · View Capture",
    desc: "Captures orthographic snapshots — front, top, sides, isometric — for analysis.",
  },
  {
    name: "Stage 2 · Smart View Selection",
    desc: "AI reviews views, picks the most informative set, sections, details, and BOM.",
  },
  {
    name: "Stage 3 · Drawing Sheet Setup",
    desc: "Creates sheets, places views at scale, exports geometry for dimensioning.",
  },
  {
    name: "Stage 4 · Dimension Planning",
    desc: "AI plans which measurements to show and where to place annotations.",
  },
  {
    name: "Stage 5 · Annotate & Export",
    desc: "Applies dimensions and exports PDF, SVG, DXF, and BOM.",
  },
];

export const SHEET_LABELS = [
  ["Front", "View"],
  ["Right", "View"],
  ["Top", "View"],
  ["Isometric", "View"],
  ["Section", "A–A"],
  ["Detail", "B"],
];

export function logLineClass(kind) {
  switch (kind) {
    case "ok":
      return styles.logOk;
    case "warn":
      return styles.logWarn;
    case "err":
      return styles.logErr;
    case "hdr":
      return styles.logHdr;
    case "dim":
      return styles.logDim;
    default:
      return styles.logInfo;
  }
}
