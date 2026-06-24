/** Applies to /dashboard and nested routes (e.g. /dashboard/2d-technical-drawing/[id], …/pipeline-status/[id]). */
import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

export const metadata = PRIVATE_PAGE_ROBOTS;

export default function DashboardLayout({ children }) {
  return children;
}
