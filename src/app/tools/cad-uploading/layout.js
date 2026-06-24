import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

/** Internal CAD upload tool — not a public SEO page. */
export const metadata = PRIVATE_PAGE_ROBOTS;

export default function CadUploadingLayout({ children }) {
  return children;
}
