import React from "react";
import Footer from "@/Components/HomePages/Footer/Footer";
import GdtPipelineView from "@/Components/GdtPipeline/GdtPipelineView";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/gdt-pipeline";

export const metadata = buildPageMetadata({
  title: "GD&T Pipeline — STEP Geometric Tolerancing | Marathon",
  description:
    "Upload a STEP file, optionally set datums and tolerances, and generate GD&T feature control frames with AI fill for blank fields.",
  canonicalPath: CANONICAL,
});

export default function GdtPipelinePage() {
  return (
    <>
      <GdtPipelineView />
      <Footer />
    </>
  );
}
