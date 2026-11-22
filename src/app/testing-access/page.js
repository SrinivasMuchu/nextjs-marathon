import { Suspense } from "react";
import TestingAccessGate from "@/Components/TestingAccess/TestingAccessGate";
import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

export const metadata = {
  title: "Testing server login",
  ...PRIVATE_PAGE_ROBOTS,
};

export default function TestingAccessPage() {
  return (
    <Suspense fallback={null}>
      <TestingAccessGate />
    </Suspense>
  );
}
