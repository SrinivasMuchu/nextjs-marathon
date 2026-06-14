/**
 * Same-origin URLs for /api/techdraw-file (inline SVG/PDF preview + optional download).
 */

export function techdrawFileApiUrl(
  designId,
  { sheet, ext, source, disposition, variant, file, prefix } = {},
) {
  const id = String(designId || "").trim();
  const params = new URLSearchParams({ designId: id });
  const outputPrefix = String(prefix || "").trim();
  if (outputPrefix) params.set("prefix", outputPrefix);
  else if (source === "user") params.set("source", "user");
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

export function techdrawSheetPreviewUrls(
  designId,
  sheetNum,
  { userPipeline = false, outputPrefix = "" } = {},
) {
  const n = Number(sheetNum);
  const prefix = String(outputPrefix || "").trim();
  if (userPipeline) {
    const base = prefix ? { prefix } : { source: "user" };
    return [
      techdrawFileApiUrl(designId, { sheet: n, ext: "svg", ...base }),
      techdrawFileApiUrl(designId, { sheet: n, ext: "svg", variant: "nodim", ...base }),
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
  { userPipeline = false, embed = true, outputPrefix = "" } = {},
) {
  const n = Number(sheetNum);
  const prefix = String(outputPrefix || "").trim();
  const url = userPipeline
    ? techdrawFileApiUrl(designId, {
        sheet: n,
        ext: "pdf",
        ...(prefix ? { prefix } : { source: "user" }),
      })
    : techdrawFileApiUrl(designId, { sheet: n, ext: "pdf" });
  return embed ? withPdfEmbedViewerParams(url) : url;
}

export function techdrawBundlePdfViewUrl(
  designId,
  { userPipeline = false, outputPrefix = "" } = {},
) {
  const prefix = String(outputPrefix || "").trim();
  if (userPipeline) {
    return withPdfEmbedViewerParams(
      techdrawFileApiUrl(designId, {
        ...(prefix ? { prefix } : { source: "user" }),
        file: "technical_drawing_simple.pdf",
      }),
    );
  }
  return `/api/techdraw-pdf-bundle?designId=${encodeURIComponent(designId)}`;
}

export function techdrawBundleZipUrl(designId, { userPipeline = false, outputPrefix = "" } = {}) {
  const id = String(designId || "").trim();
  const params = new URLSearchParams({ designId: id });
  const prefix = String(outputPrefix || "").trim();
  if (prefix) params.set("prefix", prefix);
  else if (userPipeline) params.set("source", "user");
  return `/api/techdraw-bundle-zip?${params}`;
}
