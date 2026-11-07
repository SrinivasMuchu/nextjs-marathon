"use client";

import { useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { contextState } from "@/Components/CommonJsx/ContextProvider";

export const HOME_UPLOAD_TARGET_KEY = "marathon-home-upload-target";

export function markHomeUploadTarget(href) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HOME_UPLOAD_TARGET_KEY, href);
}

/**
 * Picks up a file chosen on the home card, only on the tool page it was sent to.
 * `ready` should stay false until that page knows which extensions it accepts.
 */
export function useConsumeHomeFile(onFile, ready = true) {
  const pathname = usePathname();
  const { file, setFile } = useContext(contextState);
  const onFileRef = useRef(onFile);
  onFileRef.current = onFile;

  useEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;
    if (!(file instanceof File)) return;

    const target = window.sessionStorage.getItem(HOME_UPLOAD_TARGET_KEY);
    if (!target || target !== pathname) return;

    const next = file;
    // Wait past the setup pass so the file is still here when the page settles.
    const timer = window.setTimeout(() => {
      if (window.sessionStorage.getItem(HOME_UPLOAD_TARGET_KEY) !== pathname) return;
      window.sessionStorage.removeItem(HOME_UPLOAD_TARGET_KEY);
      setFile(null);
      onFileRef.current(next);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [file, pathname, ready, setFile]);
}
