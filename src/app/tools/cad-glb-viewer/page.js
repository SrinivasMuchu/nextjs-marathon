import React from "react";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";

// Use your **CloudFront** (or public CDN) URLs here. Raw S3 object URLs usually return 403
// in the browser unless the bucket is public — the viewer runs in the browser, not on AWS.
//
// DESIGN_STEM must match the macro INPUT_FILE name without extension (e.g. ARDUINO CAR.STEP → ARDUINO CAR).
// The macro uploads srinivas/<stem>.glb and srinivas/<stem>.json.
//
// After overwriting the same path, bump CACHE_BUST or invalidate CloudFront.
const CDN_BASE = "https://d1d8a3050v4fu6.cloudfront.net/srinivas";
const DESIGN_STEM = "ARDUINO CAR";

const GLB_URL = `${CDN_BASE}/${encodeURIComponent(DESIGN_STEM)}.glb`;
const META_URL = `${CDN_BASE}/${encodeURIComponent(DESIGN_STEM)}.json`;

/** Increment after each S3 overwrite so the browser skips cached GLB/JSON. */
const CACHE_BUST = "4";

export default function CadGlbViewerPage() {
  return (
    <GlbExplodeViewer
      glbUrl={GLB_URL}
      metaUrl={META_URL}
      cacheBust={CACHE_BUST}
    />
  );
}
