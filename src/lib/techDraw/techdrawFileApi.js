/**
 * Same-origin URLs for /api/techdraw-file (inline SVG/PDF preview + optional download).
 */

export function techdrawFileApiUrl(
  designId,
  { sheet, ext, source, disposition, variant, file } = {},
) {
  const id = String(designId || "").trim();
  const params = new URLSearchParams({ designId: id });
  if (source === "user") params.set("source", "user");
  if (file) {
    params.set("file", file);
  } else if (sheet != null && ext) {
    params.set("sheet", String(sheet));
    params.set("ext", String(ext));
  }
  if (disposition === "attachment") params.set("disposition", "attachment");
  if (variant) params.set("variant", variant);
  return `/api/techdraw-file?${params}`;
}

export function techdrawSheetPreviewUrls(designId, sheetNum, { userPipeline = false } = {}) {
  const n = Number(sheetNum);
  if (userPipeline) {
    return [
      techdrawFileApiUrl(designId, { sheet: n, ext: "svg", source: "user" }),
      techdrawFileApiUrl(designId, { sheet: n, ext: "svg", source: "user", variant: "nodim" }),
    ];
  }
  return [techdrawFileApiUrl(designId, { sheet: n, ext: "svg" })];
}

/**
 * Chrome/Edge built-in PDF viewer: hide the thumbnail sidebar on first paint.
 * @see https://pdfobject.com/pdf/pdf_open_parameters_acro8.pdf (navpanes, pagemode)
 */
export function withPdfEmbedViewerParams(pdfUrl) {
  const base = String(pdfUrl || "").trim();
  if (!base) return "";
  const params = "navpanes=0&pagemode=none";
  const hashIdx = base.indexOf("#");
  if (hashIdx === -1) return `${base}#${params}`;
  const existing = base.slice(hashIdx + 1);
  return `${base.slice(0, hashIdx + 1)}${existing ? `${existing}&${params}` : params}`;
}

export function techdrawSheetPdfViewUrl(
  designId,
  sheetNum,
  { userPipeline = false, embed = true } = {},
) {
  const n = Number(sheetNum);
  const url = userPipeline
    ? techdrawFileApiUrl(designId, { sheet: n, ext: "pdf", source: "user" })
    : techdrawFileApiUrl(designId, { sheet: n, ext: "pdf" });
  return embed ? withPdfEmbedViewerParams(url) : url;
}

export function techdrawBundlePdfViewUrl(designId, { userPipeline = false } = {}) {
  if (userPipeline) {
    return techdrawFileApiUrl(designId, {
      source: "user",
      file: "technical_drawing_simple.pdf",
    });
  }
  return `/api/techdraw-pdf-bundle?designId=${encodeURIComponent(designId)}`;
}
