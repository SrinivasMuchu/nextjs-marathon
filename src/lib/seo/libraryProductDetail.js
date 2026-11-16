const PHONE_ACCESSORY_PATTERN =
  /\b(phone|iphone|ipad|android|mobile|smartphone|tablet|watch|case|accessory|accessories|earbud|charger|dock|handset)\b/i;

const FILE_TYPE_LABELS = {
  step: "STEP",
  stp: "STEP",
  stl: "STL",
  iges: "IGES",
  igs: "IGES",
  obj: "OBJ",
  ply: "PLY",
  off: "OFF",
  dxf: "DXF",
  dwg: "DWG",
};

export const PHONE_PRODUCT_USE_CASES = [
  "Phone case design",
  "Stand and dock design",
  "Product visualization",
  "Accessory prototyping",
  "Design reference",
  "Engineering review",
];

export const MECHANICAL_PRODUCT_USE_CASES = [
  "Engineering review",
  "Manufacturing discussion",
  "Supplier communication",
  "Prototype development",
  "Design validation",
];

export const LIBRARY_BEFORE_USING_COPY =
  "Review the model dimensions, units and geometry before using it for manufacturing or production. Some files may be created for reference, visualization or workflow acceleration and may require validation before final use.";

export const LIBRARY_CAD_USAGE_NOTES =
  "Suitable for design reference, visualization, prototyping workflows and engineering review. Validate dimensions and geometry before manufacturing use.";

/** Strip trailing CAD Model suffix and file extensions for display/SEO. */
export function cleanLibraryProductName(name) {
  let cleaned = String(name || "").trim();
  if (!cleaned) return "3D CAD Model";

  cleaned = cleaned.replace(
    /\.(step|stp|stl|iges|igs|obj|ply|off|dxf|dwg|brp|brep)$/i,
    ""
  );
  cleaned = cleaned.replace(/\s+cad\s+model\s*$/i, "").trim();

  return cleaned || "3D CAD Model";
}

export function formatLibraryFileType(fileType) {
  const key = String(fileType || "step")
    .toLowerCase()
    .replace(/^\./, "");
  return FILE_TYPE_LABELS[key] || key.toUpperCase();
}

export function isPhoneAccessoryProduct({
  pageTitle = "",
  categoryLabels = [],
  tagLabels = [],
} = {}) {
  const haystack = [pageTitle, ...categoryLabels, ...tagLabels].join(" ");
  return PHONE_ACCESSORY_PATTERN.test(haystack);
}

export function getLibraryProductUseCases(design = {}) {
  const isPhone = isPhoneAccessoryProduct({
    pageTitle: design.page_title || design.part_name,
    categoryLabels: design.category_labels,
    tagLabels: design.tag_labels,
  });
  return isPhone ? PHONE_PRODUCT_USE_CASES : MECHANICAL_PRODUCT_USE_CASES;
}

export function buildLibraryDetailMetaDescription(name, fileType, { isPhoneAccessory } = {}) {
  const cleanName = cleanLibraryProductName(name);
  const format = formatLibraryFileType(fileType);
  const useCasePhrase = isPhoneAccessory
    ? "product design, prototyping, phone case design or engineering review"
    : "product design, prototyping or engineering review";

  return `Download the ${cleanName} CAD model in ${format} format. Preview the 3D file online and use it for ${useCasePhrase}.`;
}

/** Google truncates SERP titles around this length. */
export const LIBRARY_DETAIL_TITLE_MAX = 60;

const LIBRARY_DETAIL_TITLE_BRAND = " | Marathon OS";

/**
 * Short titles go out on a sample first. Search Console can compare CTR
 * for design routes whose ObjectId ends in this hex digit (~1/16 of pages)
 * with the regex `/library/.*[a-fA-F0-9]{23}0$`.
 * LIBRARY_SHORT_TITLE_ROLLOUT=all ships the short title on every product page.
 * LIBRARY_SHORT_TITLE_ROLLOUT=off keeps the legacy title everywhere.
 */
const LIBRARY_SHORT_TITLE_SAMPLE_DIGIT = "0";

const DOWNLOADABLE_CAD_SUFFIX =
  /(?:\s*[-–—|:]\s*)?downloadable\s+cad\s+representation\s*$/i;

const TRAILING_CAD_MODEL =
  /\s+(?:-\s*)?(?:detailed\s+)?(?:3d\s+)?cad\s+models?(?:\s+for\b.*)?$/i;

const LEADING_CAD_BOILERPLATE =
  /^(?:a\s+)?(?:(?:high[- ](?:precision|quality)|detailed)\s+)?(?:3d\s+)?cad\s+models?\s+of\s+/i;

const TITLE_ONLY_BOILERPLATE = /^(?:3d|cad|model|3d\s+cad|cad\s+model|3d\s+model)$/i;

/** Name used in the short SERP title: drop repeated CAD boilerplate, then cap. */
export function libraryProductTitleName(name) {
  let cleaned = String(name || "")
    .trim()
    .replace(/\.(step|stp|stl|iges|igs|obj|ply|off|dxf|dwg|brp|brep)$/i, "");

  let previous = "";
  while (cleaned && cleaned !== previous) {
    previous = cleaned;
    cleaned = cleaned
      .replace(DOWNLOADABLE_CAD_SUFFIX, "")
      .replace(TRAILING_CAD_MODEL, "")
      .replace(LEADING_CAD_BOILERPLATE, "")
      .replace(/^[-–—|:]+|[-–—|:]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!cleaned || TITLE_ONLY_BOILERPLATE.test(cleaned)) return "3D CAD Model";
  return cleaned;
}

export function capLibraryProductTitleName(name, maxLength) {
  const clean = String(name || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;

  const window = clean.slice(0, maxLength + 1);
  const space = window.lastIndexOf(" ");
  const minKeep = Math.ceil(maxLength * 0.6);
  let cut = space >= minKeep ? clean.slice(0, space) : clean.slice(0, maxLength);
  cut = cut
    .replace(/[\s,;:|/\\\-–—(&]+$/g, "")
    .replace(/(?:\s+(?:and|or|for|with|of|the|a|an|to|in|on|from|by|via|&))+$/i, "")
    .trim();
  return cut || clean.slice(0, maxLength).trim();
}

/** `{Name} | Marathon OS`, with the name capped so the full title is at most 60 characters. */
export function buildCappedLibraryDetailTitle(name) {
  const maxName = LIBRARY_DETAIL_TITLE_MAX - LIBRARY_DETAIL_TITLE_BRAND.length;
  const capped = capLibraryProductTitleName(libraryProductTitleName(name), maxName);
  return `${capped}${LIBRARY_DETAIL_TITLE_BRAND}`;
}

export function libraryRouteObjectId(route) {
  const matches = String(route || "").toLowerCase().match(/[a-f0-9]{24}/g);
  return matches ? matches[matches.length - 1] : "";
}

export function isLibraryShortTitleSample(route) {
  return libraryRouteObjectId(route).endsWith(LIBRARY_SHORT_TITLE_SAMPLE_DIGIT);
}

export function libraryShortTitleMode() {
  const mode = String(process.env.LIBRARY_SHORT_TITLE_ROLLOUT || "sample")
    .trim()
    .toLowerCase();
  if (mode === "all" || mode === "on") return "all";
  if (mode === "off" || mode === "legacy" || mode === "control") return "off";
  return "sample";
}

export function shouldUseShortLibraryDetailTitle(route) {
  const mode = libraryShortTitleMode();
  if (mode === "all") return true;
  if (mode === "off") return false;
  return isLibraryShortTitleSample(route);
}

export function buildLegacyLibraryDetailTitle(name, fileType) {
  const cleanName = cleanLibraryProductName(name);
  const format = formatLibraryFileType(fileType);
  return `${cleanName} ${format} CAD Model Download | Marathon OS`;
}

export function buildLibraryDetailTitle(name, fileType, options = {}) {
  if (shouldUseShortLibraryDetailTitle(options.route)) {
    return buildCappedLibraryDetailTitle(name);
  }
  return buildLegacyLibraryDetailTitle(name, fileType);
}

export function getFormatDownloadLabel(fileType) {
  const format = formatLibraryFileType(fileType);
  return `Download ${format} file`;
}

const STEP_DETAIL_LINKS = [
  { label: "Open this STEP file online", href: "/tools/step-file-viewer" },
  { label: "Convert STEP to STL", href: "/tools/convert-step-to-stl" },
  { label: "Convert STEP to IGES", href: "/tools/convert-step-to-iges" },
  {
    label: "Generate 2D drawings from this CAD file",
    href: "/tools/convert-step-to-2d-drawing",
  },
];

const STL_DETAIL_LINKS = [
  { label: "Open this STL file online", href: "/tools/stl-file-viewer" },
  { label: "Convert STL to STEP", href: "/tools/convert-stl-to-step" },
];

const IGES_DETAIL_LINKS = [
  { label: "Open this IGES file online", href: "/tools/iges-file-viewer" },
  { label: "Convert IGES to STEP", href: "/tools/convert-iges-to-step" },
  {
    label: "Generate 2D drawings from this CAD file",
    href: "/tools/convert-step-to-2d-drawing",
  },
];

const OBJ_DETAIL_LINKS = [
  { label: "Open this OBJ file online", href: "/tools/obj-file-viewer" },
  { label: "Open CAD file converter", href: "/tools/3d-cad-file-converter" },
];

const PLY_DETAIL_LINKS = [
  { label: "Open this PLY file online", href: "/tools/ply-file-viewer" },
  { label: "Open CAD file converter", href: "/tools/3d-cad-file-converter" },
];

const OFF_DETAIL_LINKS = [
  { label: "Open this OFF file online", href: "/tools/off-file-viewer" },
  { label: "Open CAD file converter", href: "/tools/3d-cad-file-converter" },
];

const DXF_DETAIL_LINKS = [
  { label: "Open this DXF file online", href: "/tools/dxf-file-viewer" },
  { label: "Convert DXF to DWG", href: "/tools/convert-dxf-to-dwg" },
];

const DWG_DETAIL_LINKS = [
  { label: "Open this DWG file online", href: "/tools/dwg-file-viewer" },
  { label: "Convert DWG to DXF", href: "/tools/convert-dwg-to-dxf" },
];

const LIBRARY_DETAIL_TOOL_LINKS = {
  step: STEP_DETAIL_LINKS,
  stp: STEP_DETAIL_LINKS,
  stl: STL_DETAIL_LINKS,
  iges: IGES_DETAIL_LINKS,
  igs: IGES_DETAIL_LINKS,
  obj: OBJ_DETAIL_LINKS,
  ply: PLY_DETAIL_LINKS,
  off: OFF_DETAIL_LINKS,
  dxf: DXF_DETAIL_LINKS,
  dwg: DWG_DETAIL_LINKS,
};

/** Section 4.6 — product detail internal links with spec anchor text. */
export function getLibraryProductDetailToolLinks(
  fileType,
  { hasTwoDDrawings = false, twoDDrawingHref = "", showConversionLinks = true } = {}
) {
  const key = String(fileType || "step").toLowerCase().replace(/^\./, "");
  let links = [...(LIBRARY_DETAIL_TOOL_LINKS[key] || STEP_DETAIL_LINKS)];

  // Paid designs are download-only, so only the viewer links stay.
  if (!showConversionLinks) {
    return links.filter(
      (link) =>
        !link.href.includes("/tools/convert-") &&
        !link.href.includes("/tools/convert-step-to-2d-drawing") &&
        !link.href.includes("/tools/3d-cad-file-converter")
    );
  }

  if (hasTwoDDrawings && twoDDrawingHref) {
    links.push({
      label: "View 2D technical drawings",
      href: twoDDrawingHref,
    });
  }

  return links;
}
