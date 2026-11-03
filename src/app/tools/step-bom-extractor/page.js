import { Suspense } from "react";
import StepBomExtractorClient from "@/Components/StepBomTree/StepBomExtractorClient";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/step-bom-extractor";

export const metadata = buildPageMetadata({
  title: "STEP BOM Extractor – Bill of Materials from STEP & STP | Marathon OS",
  description:
    "Extract a bill of materials from STEP and STP assemblies online. Get every part name and quantity, then download it as Excel.",
  canonicalPath: CANONICAL,
});

export default function StepBomExtractorToolPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading STEP BOM tool…</div>}>
      <StepBomExtractorClient />
    </Suspense>
  );
}
