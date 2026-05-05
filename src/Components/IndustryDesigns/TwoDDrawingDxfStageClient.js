"use client";

import { useEffect, useRef, useState } from "react";
import { techdrawAssetProxyUrl } from "@/lib/techDraw/techdrawPreviewProxy";
import styles from "./TwoDDrawingSheetViewerClient.module.css";

export default function TwoDDrawingDxfStageClient({ dxfUrl, alt }) {
  const hostRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stopped = false;

    async function renderDxf() {
      if (!hostRef.current || !dxfUrl) return;
      hostRef.current.innerHTML = "";
      setError("");

      try {
        const [DxfParserMod, ThreeDxfMod] = await Promise.all([
          import("dxf-parser"),
          import("three-dxf"),
        ]);
        if (stopped || !hostRef.current) return;

        const res = await fetch(techdrawAssetProxyUrl(dxfUrl), { cache: "no-store" });
        if (!res.ok) throw new Error(`DXF fetch failed (${res.status})`);
        const content = await res.text();

        const DxfParser = DxfParserMod.default || DxfParserMod;
        const parser = new DxfParser();
        const dxf = parser.parseSync(content);

        const host = hostRef.current;
        const w = host.clientWidth || 800;
        const h = host.clientHeight || 370;
        const Viewer = ThreeDxfMod.Viewer;
        const viewer = new Viewer(dxf, host, w, h);
        viewer.render();
      } catch (e) {
        if (!stopped) setError(e?.message || "Unable to render DXF");
      }
    }

    renderDxf();
    return () => {
      stopped = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [dxfUrl]);

  if (!dxfUrl) return null;

  return (
    <div className={styles.dxfWrap}>
      <div ref={hostRef} className={styles.dxfMount} aria-label={alt} />
      {error ? <div className={styles.dxfError}>{error}</div> : null}
    </div>
  );
}

