import { Suspense } from "react";
import StepBomExtractorClient from "@/Components/StepBomTree/StepBomExtractorClient";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/step-bom-extractor";

export const metadata = buildPageMetadata({
  title: "STEP BOM Extractor Online | Extract BOM from STEP Files | Marathon OS",
  description:
    "Upload a STEP or STP assembly to extract its parts list, quantities and assembly hierarchy. Review the BOM and product structure online with Marathon OS.",
  canonicalPath: CANONICAL,
  ogTitle: "STEP BOM Extractor Online | Marathon OS",
  ogDescription:
    "Extract a bill of materials and assembly tree from STEP or STP files online.",
});

export default function StepBomExtractorToolPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading STEP BOM tool…</div>}>
      <StepBomExtractorClient />
    </Suspense>
  );
}
