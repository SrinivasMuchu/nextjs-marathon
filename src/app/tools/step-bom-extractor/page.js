import { Suspense } from "react";
import StepBomTreePage from "@/Components/StepBomTree/StepBomTreePage";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/step-bom-extractor";

export const metadata = buildPageMetadata({
  title: "STEP BOM Extractor | Marathon OS",
  description:
    "Upload a STEP assembly and extract its bill of materials tree. Kafka-backed FreeCAD worker reads product structure and quantities.",
  canonicalPath: CANONICAL,
});

export default function StepBomExtractorToolPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading STEP BOM tool…</div>}>
      <StepBomTreePage />
    </Suspense>
  );
}
