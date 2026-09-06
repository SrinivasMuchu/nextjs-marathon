import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BASE_URL } from "@/config";
import CadProductsShowcaseClient from "./CadProductsShowcaseClient";
import styles from "./CadProductsShowcase.module.css";

async function getCategoriesAndDesigns() {
  try {
    const categoriesRes = await fetch(`${BASE_URL}/v1/cad/get-categories`, {
      cache: "no-store",
    });
    const categoriesJson = await categoriesRes.json();
    const categoriesData =
      categoriesJson?.data?.data || categoriesJson?.data || categoriesJson || [];
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    const designsByCategory = {};
    await Promise.all(
      categories.map(async (category) => {
        const categoryName = category.industry_category_name || category.name;
        if (!categoryName) return;
        try {
          const designsRes = await fetch(
            `${BASE_URL}/v1/cad/get-category-design?category=${encodeURIComponent(
              categoryName,
            )}&limit=8&page=1&random=true`,
            { cache: "no-store" },
          );
          const designsJson = await designsRes.json();
          const designsData = designsJson?.data?.designDetails || [];
          designsByCategory[categoryName] = Array.isArray(designsData) ? designsData : [];
        } catch {
          designsByCategory[categoryName] = [];
        }
      }),
    );

    return { categories, designsByCategory };
  } catch {
    return { categories: [], designsByCategory: {} };
  }
}

async function CadProductsShowcase() {
  const { categories, designsByCategory } = await getCategoriesAndDesigns();

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

        <CadProductsShowcaseClient
          categories={categories}
          designsByCategory={designsByCategory}
        />
      </div>
    </section>
  );
}

export default CadProductsShowcase;
