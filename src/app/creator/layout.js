import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

/** Creator profile pages are user-specific and should not be indexed. */
export const metadata = PRIVATE_PAGE_ROBOTS;

export default function CreatorLayout({ children }) {
  return children;
}
