import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

/** Applies to /admin and all nested admin routes. */
export const metadata = PRIVATE_PAGE_ROBOTS;

export default function AdminLayout({ children }) {
  return children;
}
