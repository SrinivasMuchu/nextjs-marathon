const JOB_PREVIEW_KEY = "cadConverterJobPreview";

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
