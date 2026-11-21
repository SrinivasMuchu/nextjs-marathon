const JOB_PREVIEW_KEY = "cadConverterJobPreview";

/** Same order as `CONVERTER_HUB_PAGE.directoryFilters`, without "All". */
export const CAD_CONVERTER_GROUP_ORDER = [
  "STEP",
  "IGES",
  "STL",
  "3MF",
  "OBJ",
  "PLY",
  "OFF",
  "BREP",
  "3DM",
  "DWG",
  "DXF",
];

/**
 * Group dedicated converter routes by source format.
 * `routes` is `popularCadConverterTypes` so the boxes stay the converter page's boxes.
 */
export function getCadConverterRouteGroups(routes, order = CAD_CONVERTER_GROUP_ORDER) {
  const groups = new Map();

  (routes || []).forEach((item) => {
    if (!groups.has(item.from)) groups.set(item.from, []);
    groups.get(item.from).push(item);
  });

  return [...groups.entries()]
    .sort((a, b) => {
      const aIndex = order.indexOf(a[0]);
      const bIndex = order.indexOf(b[0]);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    })
    .map(([from, items]) => ({ from, items }));
}

export function cadConverterHref(path) {
  const pair = String(path || "").replace(/^\//, "");
  return `/tools/convert-${pair}`;
}

/** Status page for an in-progress / finished converter job (`?fileid=`). */
export function cadConverterStatusPath(fileId) {
  const id = String(fileId || "").trim();
  if (!id) return "/cad-convertor";
  return `/cad-convertor?fileid=${encodeURIComponent(id)}`;
}

export function saveCadConverterJobPreview(preview) {
  if (typeof window === "undefined" || !preview?.fileId) return;
  try {
    sessionStorage.setItem(JOB_PREVIEW_KEY, JSON.stringify(preview));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function readCadConverterJobPreview(fileId) {
  if (typeof window === "undefined" || !fileId) return null;
  try {
    const raw = sessionStorage.getItem(JOB_PREVIEW_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (String(data?.fileId) !== String(fileId)) return null;
    return data;
  } catch {
    return null;
  }
}

export function getCadConverterFileIdFromSearchParams(searchParams) {
  if (!searchParams) return "";
  return (
    searchParams.get("fileid") ||
    searchParams.get("fileId") ||
    searchParams.get("id") ||
    searchParams.get("folderId") ||
    ""
  );
}
