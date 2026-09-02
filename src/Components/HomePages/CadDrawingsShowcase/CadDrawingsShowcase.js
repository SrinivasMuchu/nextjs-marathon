import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BASE_URL } from "@/config";
import { buildTwoDLibraryDesignsParams } from "@/api/twoDLibraryDesignsApi";
import { fetchTwoDLibraryListPriceDisplay } from "@/lib/twoDPricing";
import CadDrawingCard from "./CadDrawingCard";
import styles from "./CadDrawingsShowcase.module.css";

async function getFeaturedDrawings() {
  try {
    const params = buildTwoDLibraryDesignsParams({ page: 1, limit: 3, sort: "newest" });
    const queryString = new URLSearchParams(params).toString();
    const [response, pricing] = await Promise.all([
      fetch(`${BASE_URL}/v1/cad/get-category-design?${queryString}`, {
        cache: "no-store",
      }),
      fetchTwoDLibraryListPriceDisplay(),
    ]);
    const data = await response.json();
    const designs = data?.data?.designDetails || [];
    const totalItems = data?.data?.pagination?.totalItems;
    return {
      designs: Array.isArray(designs) ? designs : [],
      totalItems: Number.isFinite(Number(totalItems)) ? Number(totalItems) : null,
      defaultPriceLabel: pricing?.priceLabel || "",
    };
  } catch {
    return { designs: [], totalItems: null, defaultPriceLabel: "" };
  }
}

function formatCount(totalItems) {
  if (totalItems == null) return "3,000+";
  return totalItems.toLocaleString();
}

async function CadDrawingsShowcase() {
  const { designs, totalItems, defaultPriceLabel } = await getFeaturedDrawings();
  const countLabel = formatCount(totalItems);

  return (
    <section className={styles.section} id="cad-drawings">
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div>
            <p className={styles.label}>2D CAD PRODUCTS</p>
            <h2 className={styles.title}>Put a clear drawing in front of the workshop.</h2>
            <p className={styles.description}>
              Explore {countLabel} technical drawing sets with practical outputs for quoting, review
              and production.
            </p>
          </div>
          <Link className={styles.ctaButton} href="/library/2d-technical-drawings">
            See all 2D products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        {designs.length > 0 ? (
          <div className={styles.grid}>
            {designs.map((design) => (
              <CadDrawingCard
                key={design._id || design.route}
                design={design}
                defaultPriceLabel={defaultPriceLabel}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No drawing sets available right now.</p>
        )}
      </div>
    </section>
  );
}

export default CadDrawingsShowcase;
