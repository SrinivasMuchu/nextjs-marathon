import StepBomTreePage from "@/Components/StepBomTree/StepBomTreePage";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/step-bom-tree";

export const metadata = buildPageMetadata({
  title: "STEP BOM Tree Extractor | Marathon OS",
  description:
    "Upload a STEP assembly and extract its bill of materials tree. Kafka-backed FreeCAD worker reads product structure and quantities.",
  canonicalPath: CANONICAL,
});

export default function StepBomTreeToolPage() {
  return <StepBomTreePage />;
}
