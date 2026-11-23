import { Suspense } from "react";
import EmailRatingPage from "@/Components/Feedback/EmailRatingPage";
import { PRIVATE_PAGE_ROBOTS } from "@/lib/seo/privatePageMetadata";

export const metadata = {
  title: "Rate your file | Marathon OS",
  ...PRIVATE_PAGE_ROBOTS,
};

export default function FeedbackRatePage() {
  return (
    <Suspense fallback={null}>
      <EmailRatingPage />
    </Suspense>
  );
}
