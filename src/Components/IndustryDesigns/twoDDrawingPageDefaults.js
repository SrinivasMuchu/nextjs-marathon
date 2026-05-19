/** Default sheet list for 2D drawing preview. Point `src` at files under /public when available. */
export const DEFAULT_2D_SHEETS = [
  { src: "", label: "Sheet 1 — Front View" },
  { src: "", label: "Sheet 2 — Top View" },
  { src: "", label: "Sheet 3 — Left Side View" },
  { src: "", label: "Sheet 4 — Right Side View" },
  { src: "", label: "Sheet 5 — Section A-A (Longitudinal)" },
  { src: "", label: "Sheet 6 — Section B-B (Horizontal)" },
  { src: "", label: "Sheet 7 — Detail Views C & D" },
  { src: "", label: "Sheet 8 — Isometric View" },
  { src: "", label: "Sheet 9 — Front View with Hidden Lines" },
];

/** Per-sheet download targets (place files under /public/2d-drawings/… or override via props). */
export const DEFAULT_SHEET_DOWNLOAD_ROWS = DEFAULT_2D_SHEETS.map((s, i) => {
  const n = i + 1;
  return {
    name: s.label,
    pdf: `/2d-drawings/sheet_${n}.pdf`,
    svg: `/2d-drawings/svg/sheet_${n}.svg`,
    dxf: `/2d-drawings/dxf/sheet_${n}.dxf`,
    png: `/2d-drawings/png_dim/sheet_${n}.png`,
  };
});
