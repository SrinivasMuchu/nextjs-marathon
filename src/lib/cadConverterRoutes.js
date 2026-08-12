/** Status page for an in-progress / finished converter job (`?fileid=`). */
export function cadConverterStatusPath(fileId) {
  const id = String(fileId || "").trim();
  if (!id) return "/cad-convertor";
  return `/cad-convertor?fileid=${encodeURIComponent(id)}`;
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
