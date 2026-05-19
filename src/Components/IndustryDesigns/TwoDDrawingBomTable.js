/**
 * BOM (Bill of Materials) table — disabled.
 * Previous implementation used TwoDDrawingBomTable.module.css and accepted `rows` / default demo rows.
 * To restore: uncomment usage in TwoDTechnicalDrawingContent.js, re-enable bom.json in fetchTechDrawBundle.js,
 * and restore the component body from version control.
 */
export default function TwoDDrawingBomTable() {
  return null;
}

/*
import styles from "./TwoDDrawingBomTable.module.css";

const defaultRows = [
  ["Main Shell Body", "SA-240 Stainless Steel 316L", "1"],
  ...
];

export default function TwoDDrawingBomTable({ rows }) {
  const data = rows === undefined ? defaultRows : rows;
  if (!data.length) return null;
  return ( ... );
}
*/
