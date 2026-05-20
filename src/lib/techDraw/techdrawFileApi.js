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

export function techdrawSheetPdfViewUrl(designId, sheetNum, { userPipeline = false } = {}) {
  const n = Number(sheetNum);
  if (userPipeline) {
    return techdrawFileApiUrl(designId, { sheet: n, ext: "pdf", source: "user" });
  }
  return techdrawFileApiUrl(designId, { sheet: n, ext: "pdf" });
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
