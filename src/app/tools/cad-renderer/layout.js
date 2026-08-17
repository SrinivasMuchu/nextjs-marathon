import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

/** Internal CAD viewer (fileId/designId query URLs) — not a public SEO page. */
export const metadata = {
  title: "CAD Renderer | Marathon OS",
  ...PRIVATE_PAGE_ROBOTS,
};

export default function CadRendererLayout({ children }) {
  return children;
}
