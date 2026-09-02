import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BASE_URL } from "@/config";
import CadProductCard from "./CadProductCard";
import styles from "./CadProductsShowcase.module.css";

async function getFeaturedDesigns() {
  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-recently-added-designs?limit=4`, {
      cache: "no-store",
    });
    const data = await response.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function CadProductsShowcase() {
  const designs = await getFeaturedDesigns();

  return (
    <section className={styles.section} id="cad-products">
      <div className={styles.shell}>
        <header className={styles.heading}>
          <div>
            <p className={styles.label}>3D CAD PRODUCTS</p>
            <h2 className={styles.title}>Start from a model that is ready to work.</h2>
            <p className={styles.description}>
              Browse 10,000+ quality-checked 3D CAD products for design, prototyping and
              manufacturing.
            </p>
          </div>
          <Link className={styles.ctaButton} href="/library">
            See all 3D products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        {designs.length > 0 ? (
          <div className={styles.grid}>
            {designs.map((design, index) => (
              <CadProductCard key={design._id || design.route} design={design} index={index} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>No products available right now.</p>
        )}
      </div>
    </section>
  );
}

export default CadProductsShowcase;
