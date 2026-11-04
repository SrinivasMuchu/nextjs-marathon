"use client";

import { useEffect, useState } from "react";

const USER_FOLDERS = new Set([
  "freecad-techdraw",
  "freecad-2d-techdraw",
  "user-freecad-techdraw",
  "qwen_tech_draw_designs",
  "techdraw-output",
]);

export function techDrawAuthHeaders() {
  if (typeof window === "undefined") return {};
  const headers = {};
  const uuid = localStorage.getItem("uuid");
  const adminUuid = localStorage.getItem("admin-uuid");
  if (uuid) headers["user-uuid"] = uuid;
  if (adminUuid) headers["admin-uuid"] = adminUuid;
  return headers;
}

/** Customer-upload files are served by our API, which sends the signed-in user. */
export function isUserPipelineApiUrl(url) {
  const raw = String(url || "").split("#")[0];
  if (!raw.includes("/api/techdraw-file")) return false;
  try {
    const parsed = new URL(raw, "https://marathon.local");
    if ((parsed.searchParams.get("source") || "").toLowerCase() === "user") return true;
    const folder = String(parsed.searchParams.get("prefix") || "").split("/")[0];
    return USER_FOLDERS.has(folder);
  } catch {
    return false;
  }
}

export function useAuthedTechDrawSrc(url) {
  const [resolved, setResolved] = useState("");

  useEffect(() => {
    const raw = String(url || "");
    if (!raw) {
      setResolved("");
      return undefined;
    }
    if (!isUserPipelineApiUrl(raw)) {
      setResolved(raw);
      return undefined;
    }

    let objectUrl = "";
    let cancelled = false;
    const hash = raw.includes("#") ? raw.slice(raw.indexOf("#")) : "";

    (async () => {
      try {
        const res = await fetch(raw.split("#")[0], {
          headers: techDrawAuthHeaders(),
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setResolved(`${objectUrl}${hash}`);
      } catch {
        if (!cancelled) setResolved("");
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return resolved;
}
