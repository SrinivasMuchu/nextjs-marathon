import { ASSET_PREFIX_URL } from "@/config";
import CadDrawingPipelineView from "@/Components/CadDrawingPipeline/CadDrawingPipelineView";
import { JetBrains_Mono, Syne } from "next/font/google";
import React from "react";

const SITE = "https://marathon-os.com";
const CANONICAL = "/tools/cad-drawing-pipeline";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-pipeline-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-pipeline-mono",
  display: "swap",
});

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
  return (
    <div className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <CadDrawingPipelineView />
    </div>
  );
}
