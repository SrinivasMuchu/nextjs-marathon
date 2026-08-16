import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

/** Converter job status (`?fileid=`) — private, never indexed. */
export const metadata = {
  title: "CAD Converter Status | Marathon OS",
  ...PRIVATE_PAGE_ROBOTS,
};

export default function CadConvertorLayout({ children }) {
  return children;
}
