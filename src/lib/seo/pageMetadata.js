import { ASSET_PREFIX_URL } from "@/config";

const SITE_ORIGIN = "https://marathon-os.com";
const DEFAULT_OG_IMAGE = `${ASSET_PREFIX_URL}logo-1.png`;

export function buildSocialMetadata({ title, description, canonicalPath, pageUrl }) {
  const url = pageUrl || `${SITE_ORIGIN}${canonicalPath}`;
  const imageUrl = DEFAULT_OG_IMAGE;

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: "Marathon OS",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildPageMetadata({
  title,
  description,
  canonicalPath,
  pageUrl,
  metadataBase = SITE_ORIGIN,
  extra = {},
}) {
  return {
    title,
    description,
    metadataBase: new URL(metadataBase),
    alternates: { canonical: canonicalPath },
    ...buildSocialMetadata({ title, description, canonicalPath, pageUrl }),
    ...extra,
  };
}

/** Manager spec: {CAD Model Name} CAD Model Download | Marathon OS */
export function buildLibraryDetailMetadata(productName) {
  const name = String(productName || "3D CAD Model").trim();
  const title = `${name} CAD Model Download | Marathon OS`;
  const description = `Download the ${name} CAD model from Marathon OS. Preview, access and use engineering-ready CAD files for product design, prototyping and manufacturing workflows.`;
  return { title, description, name };
}

/** Manager spec: {Product Name} 2D CAD Drawing Sheets - PDF, DXF & SVG | Marathon OS */
function humanizeViewName(name) {
  const raw = String(name || "").trim().toLowerCase();
  if (!raw) return null;
  if (/iso/.test(raw)) return "isometric";
  if (/front/.test(raw)) return "front";
  if (/top/.test(raw)) return "top";
  if (/bottom/.test(raw)) return "bottom";
  if (/rear|back/.test(raw)) return "rear";
  if (/right/.test(raw)) return "right";
  if (/left/.test(raw)) return "left";
  if (/side/.test(raw)) return "side";
  return raw.replace(/_/g, " ");
}

function formatViewTypeList(viewNames) {
  const types = [
    ...new Set(
      (viewNames || [])
        .map(humanizeViewName)
        .filter(Boolean)
    ),
  ];
  if (types.length === 0) return "orthographic views";
  if (types.length === 1) return `${types[0]} views`;
  if (types.length === 2) return `${types[0]} and ${types[1]} views`;
  const last = types[types.length - 1];
  return `${types.slice(0, -1).join(", ")} and ${last} views`;
}

function formatSectionDetailType(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const sectionEntries = list.filter(
    (e) => /section/i.test(`${e?.label || ""} ${e?.view_name || ""}`)
  );
  const detailEntries = list.filter(
    (e) => /detail/i.test(`${e?.label || ""} ${e?.view_name || ""}`)
  );

  if (sectionEntries.length > 0 && detailEntries.length > 0) {
    const sectionLabel = String(sectionEntries[0]?.label || "section").trim();
    return `${sectionLabel.toLowerCase()} cuts and detail views`;
  }
  if (sectionEntries.length > 0) {
    if (sectionEntries.length === 1) {
      const label = String(sectionEntries[0]?.label || "section cuts").trim();
      return label.toLowerCase();
    }
    return "section cuts";
  }
  if (detailEntries.length > 0) return "detail views";
  return "section and detail views";
}

/** Build view/section copy for meta description from geometry_per_sheet.json entries. */
export function deriveTwoDDrawingMetaFromGeometry(geometryPerSheet) {
  const entries =
    geometryPerSheet && typeof geometryPerSheet === "object"
      ? Object.values(geometryPerSheet)
      : [];
  const viewNames = entries.map((e) => e?.view_name).filter(Boolean);

  return {
    viewType: formatViewTypeList(viewNames),
    sectionDetailType: formatSectionDetailType(entries),
  };
}

export function buildTwoDDrawingMetadata(
  productName,
  { viewType, sectionDetailType } = {}
) {
  const name = String(productName || "Product").trim();
  const views = viewType || "orthographic views";
  const sections = sectionDetailType || "section and detail views";
  const title = `${name} 2D CAD Drawing Sheets - PDF, DXF & SVG | Marathon OS`;
  const description = `Download free ${name} 2D CAD drawing sheets with ${views} and ${sections}. Get PDF, DXF and SVG files created from a high-quality 3D CAD model.`;
  return { title, description, name };
}
