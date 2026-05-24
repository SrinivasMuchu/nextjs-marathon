import Link from "next/link";
import FallbackImageClient from "@/Components/CommonJsx/FallbackImageClient";
import { TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { techdrawFileApiUrl } from "@/lib/techDraw/techdrawFileApi";
import { PIPELINE_DEMO_DESIGN_ID } from "./pipelineConstants";
import styles from "./CadDrawingPipeline.module.css";

const FORMATS = [
  { key: "pdf", label: "PDF", className: styles.sampleFormatPdf },
  { key: "svg", label: "SVG", className: styles.sampleFormatSvg },
  { key: "dxf", label: "DXF", className: styles.sampleFormatDxf },
  { key: "png", label: "PNG", className: styles.sampleFormatPng },
];

function pngHref(designId, sheetNum) {
  return `${TECH_DRAW_LIBRARY_PREFIX}/${designId}/png_dim/sheet_${sheetNum}.png`;
}

function sheetRowsWithPng(sheetDownloadRows, designId) {
  return sheetDownloadRows.map((row, idx) => ({
    ...row,
    png: pngHref(designId, idx + 1),
  }));
}

export default async function CadDrawingPipelineSampleSheets() {
  const bundle = await fetchTechDrawBundle(PIPELINE_DEMO_DESIGN_ID);
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    return null;
  }

  const props = mapTechDrawBundleToPageProps(PIPELINE_DEMO_DESIGN_ID, bundle);
  const { sheets, sheetDownloadRows, heroProps } = props;
  const rows = sheetRowsWithPng(sheetDownloadRows, PIPELINE_DEMO_DESIGN_ID);

  const designRoute = String(bundle.designMeta?.route || "").trim();
  const fullSetHref = designRoute
    ? `/library/2d-technical-drawings/${encodeURIComponent(designRoute)}`
    : `/library/2d-technical-drawings/${PIPELINE_DEMO_DESIGN_ID}`;

  if (!sheets.length) return null;

  return (
    <section className={styles.sampleGallery} aria-labelledby="cad-pipeline-gallery-title">
      <p className={styles.sampleGalleryLabel}>Output gallery</p>
      <div className={styles.sampleGalleryHead}>
        <div>
          <h2 id="cad-pipeline-gallery-title" className={styles.sampleGalleryTitle}>
            Sample Drawing Sheets
          </h2>
          <p className={styles.sampleGalleryDesc}>
            Every drawing set includes orthographic views, section cuts, detail views, and a bill
            of materials.{" "}
            <span className={styles.sampleAiTag}>AI generated</span>
          </p>
        </div>
        <Link href={fullSetHref} className={styles.sampleGalleryLink}>
          View full set →
        </Link>
      </div>

      <div className={styles.sampleSheetGrid}>
        {sheets.map((sheet, idx) => {
          const row = rows[idx] || {};
          const previewSrc =
            sheet.src ||
            techdrawFileApiUrl(PIPELINE_DEMO_DESIGN_ID, {
              sheet: idx + 1,
              ext: "svg",
            });
          return (
            <article key={sheet.label || idx} className={styles.sampleSheetCard}>
              <div className={styles.sampleSheetPreview}>
                <FallbackImageClient
                  className={styles.sampleSheetImg}
                  src={previewSrc}
                  alt={sheet.label || `Drawing sheet ${idx + 1}`}
                />
              </div>
              <div className={styles.sampleSheetFoot}>
                <h3 className={styles.sampleSheetTitle}>{sheet.label}</h3>
                <div className={styles.sampleSheetFormats}>
                  {FORMATS.map(({ key, label, className }) => {
                    const href = row[key];
                    if (!href) return null;
                    return (
                      <a
                        key={key}
                        href={href}
                        className={`${styles.sampleFormatBadge} ${className}`}
                        download
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {heroProps?.stats?.length ? (
        <p className={styles.sampleGalleryMeta}>
          Example: {heroProps.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
        </p>
      ) : null}
    </section>
  );
}
