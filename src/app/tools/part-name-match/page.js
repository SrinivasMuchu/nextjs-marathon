import { Suspense } from "react";
import TextMatchView from "@/Components/TextMatch/TextMatchView";
import { buildPageMetadata } from "@/lib/seo/pageMetadata";

const CANONICAL = "/tools/part-name-match";

export const metadata = buildPageMetadata({
  title: "Part Name Match — Find CAD Designs by GLB Part Name | Marathon OS",
  description:
    "Enter a GLB metadata part name and find matching live CAD designs in the Marathon library via API search on indexed part names.",
  canonicalPath: CANONICAL,
  ogTitle: "Part Name Match | Marathon OS",
  ogDescription: "Search library designs by GLB metadata part names.",
});

export default function PartNameMatchPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading part-name match…</div>}>
      <TextMatchView />
    </Suspense>
  );
}
