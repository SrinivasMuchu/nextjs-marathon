import React from "react";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";

// Static sample URLs; replace with your own S3 paths as needed
const GLB_URL =
  "https://d1d8a3050v4fu6.cloudfront.net/srinivas/Unnamed2.glb";
const META_URL =
  "https://d1d8a3050v4fu6.cloudfront.net/srinivas/Unnamed2.json";

export default function CadGlbViewerPage() {
  return <GlbExplodeViewer glbUrl={GLB_URL} metaUrl={META_URL} />;
}

