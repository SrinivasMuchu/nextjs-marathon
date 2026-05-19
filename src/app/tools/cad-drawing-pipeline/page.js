import { ASSET_PREFIX_URL } from "@/config";
import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
import React from "react";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

export const metadata = {
  title: "CAD drawing pipeline (STEP → TechDraw) | Marathon OS",
  description:
    "Upload a STEP file to generate technical drawings via the Marathon OS drawing pipeline.",
  openGraph: {
    images: [{ url: `${ASSET_PREFIX_URL}logo-1.png`, width: 1200, height: 630, type: "image/png" }],
  },
  metadataBase: new URL(SITE),
  alternates: { canonical: CANONICAL },
};

export default function CadDrawingPipelinePage() {
  return <CadDrawingPipelineView />;
}
