import React from "react";
import { getPublicQuotes } from "@/api/feedbackQuotesApi";
import styles from "./Feedback.module.css";

function stars(n) {
  const k = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★".repeat(k) + "☆".repeat(5 - k);
}

/**
 * Flow 8b: moderated quotes on a converter page, under the hero. Plain HTML only — no review/star markup (D7).
 * Quotes come from this route, topped up from its family, labelled "Selected reviews". The average counts every
 * rating for the page, low ones included, and appears only from 5 ratings (8c). Renders nothing with no quotes.
 * Never used on the homepage.
 */
export default async function ConverterReviews({ conversionParams }) {
  let data = null;
  try {
    data = await getPublicQuotes({ route: conversionParams });
  } catch {
    data = null;
  }
  if (!data?.quotes?.length) return null;
  const [from, to] = String(conversionParams || "").split("-to-");
  const pair = from && to ? `${from.toUpperCase()} → ${to.toUpperCase()}` : "this converter";

  return (
    <section className={styles.reviewsSection} aria-labelledby="converter-reviews-heading">
      <div className={styles.reviewsHead}>
        <h2 id="converter-reviews-heading">{data.label || "Selected reviews"}</h2>
        {data.average != null && data.rating_count ? (
          <span className={styles.reviewsAvg}>
            {pair}: {data.average.toFixed(1)} out of 5 from {data.rating_count} ratings — every rating counted, low ones included.
          </span>
        ) : null}
      </div>
      <div className={styles.reviewsGrid}>
        {data.quotes.map((q) => (
          <figure key={q._id} className={styles.reviewCard}>
            {q.rating ? <span className={styles.reviewStars} aria-label={`${q.rating} out of 5`}>{stars(q.rating)}</span> : null}
            <blockquote>{q.text}</blockquote>
            <figcaption>
              {[q.display_name, q.role, q.company].filter(Boolean).join(" · ")}
              {!q.own_route && q.input_format && q.output_format
                ? ` · ${String(q.input_format).toUpperCase()} → ${String(q.output_format).toUpperCase()}`
                : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
