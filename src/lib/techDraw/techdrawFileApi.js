/**
 * Same-origin URLs for /api/techdraw-file (inline SVG/PDF preview + optional download).
 */

import { DESIGN_GLB_PREFIX_URL } from "@/config";

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

/** Dashboard/history card previews — API proxy first, then direct CDN fallbacks. */
export function techdrawJobPreviewCandidates(job, sheetNum = 1) {
  const id = String(job?._id || job?.id || "").trim();
  if (!/^[a-f0-9]{24}$/i.test(id)) return [];

  const outputPrefix = String(job?.output_s3_prefix || "").trim();
  const n = Number(sheetNum);
  const cdn = DESIGN_GLB_PREFIX_URL.replace(/\/$/, "");

  const urls = techdrawSheetPreviewUrls(id, n, {
    userPipeline: true,
    outputPrefix,
  });

  const prefixPaths = new Set();
  if (outputPrefix) prefixPaths.add(outputPrefix);
  prefixPaths.add(`qwen_tech_draw_designs/${id}`);
  prefixPaths.add(`user-freecad-techdraw/${id}`);

  for (const prefixPath of prefixPaths) {
    const direct = `${cdn}/${prefixPath}/svg/sheet_${n}.svg`;
    if (!urls.includes(direct)) urls.push(direct);
  }

  return urls;
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

export function techdrawBundleZipUrl(
  designId,
  { userPipeline = false, outputPrefix = "", format } = {},
) {
  const id = String(designId || "").trim();
  const params = new URLSearchParams({ designId: id });
  const prefix = String(outputPrefix || "").trim();
  if (prefix) params.set("prefix", prefix);
  else if (userPipeline) params.set("source", "user");
  const fmt = String(format || "").trim().toLowerCase();
  if (fmt === "pdf" || fmt === "svg" || fmt === "dxf") params.set("format", fmt);
  return `/api/techdraw-bundle-zip?${params}`;
}
