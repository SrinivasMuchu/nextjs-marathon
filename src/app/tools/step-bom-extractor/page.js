import StepBomJobPage from "@/Components/StepBomTree/StepBomJobPage";
import StepBomTreePage from "@/Components/StepBomTree/StepBomTreePage";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/step-bom-extractor";

export const metadata = buildPageMetadata({
  title: "STEP BOM Extractor – Bill of Materials from STEP & STP | Marathon OS",
  description:
    "Extract a bill of materials from STEP and STP assemblies online. Get every part name and quantity, then download it as Excel.",
  canonicalPath: CANONICAL,
});

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

// Pick the view from the server-side searchParams prop instead of useSearchParams()
// under <Suspense>: that forced client-only rendering, so crawlers got only
// "Loading STEP BOM tool…" with no hero, copy or FAQ.
export default function StepBomExtractorToolPage({ searchParams = {} }) {
  const fileId = String(
    firstParam(searchParams.fileid) ||
      firstParam(searchParams.fileId) ||
      firstParam(searchParams.jobId) ||
      firstParam(searchParams.job_id) ||
      firstParam(searchParams.id) ||
      "",
  ).trim();
  if (fileId) return <StepBomJobPage jobId={fileId} />;
  return <StepBomTreePage />;
}
