import React from "react";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";

const STATIC_GLB_URL =
  "https://d1d8a3050v4fu6.cloudfront.net/srinivas/Unnamed1.glb";

export default function CadGlbViewerPage() {
  return <GlbExplodeViewer glbUrl={STATIC_GLB_URL} />;
}

