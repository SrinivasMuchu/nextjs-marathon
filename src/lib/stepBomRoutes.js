export function stepBomJobPath(fileId) {
  const id = String(fileId || "").trim();
  if (!id) return "/tools/step-bom-extractor";
  return `/tools/step-bom-extractor?fileid=${encodeURIComponent(id)}`;
}

export function getStepBomFileIdFromSearchParams(searchParams) {
  if (!searchParams) return "";
  return (
    searchParams.get("fileid") ||
    searchParams.get("fileId") ||
    searchParams.get("jobId") ||
    searchParams.get("job_id") ||
    searchParams.get("id") ||
    ""
  );
}
