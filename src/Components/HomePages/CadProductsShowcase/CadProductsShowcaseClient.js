"use client";

import { useMemo, useState } from "react";
import CadProductCard from "./CadProductCard";
import styles from "./CadProductsShowcase.module.css";

function getCategoryName(category) {
  return (
    category?.industry_category_name ||
    category?.name ||
    category?.industry_category_label ||
    category?.title ||
    ""
  );
}

function CadProductsShowcaseClient({ categories = [], designsByCategory = {} }) {
  const preferred =
    categories.find((cat) =>
      getCategoryName(cat).toLowerCase().includes("3d printing"),
    ) || categories[0];

  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryName(preferred) || Object.keys(designsByCategory)[0] || "",
  );

  const designs = useMemo(() => {
    const list = designsByCategory[selectedCategory] || [];
    return list.slice(0, 4);
  }, [designsByCategory, selectedCategory]);

  if (!categories.length) {
    return <p className={styles.emptyState}>No products available right now.</p>;
  }

  return (
    <>
      <div className={styles.categoryRow} role="tablist" aria-label="Product categories">
        {categories.map((category) => {
          const name = getCategoryName(category);
          if (!name) return null;
          const active = name === selectedCategory;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.categoryPill} ${active ? styles.categoryPillActive : ""}`}
              onClick={() => setSelectedCategory(name)}
            >
              {name}
            </button>
          );
        })}
      </div>

      {designs.length > 0 ? (
        <div className={styles.grid}>
          {designs.map((design, index) => (
            <CadProductCard key={design._id || design.route} design={design} index={index} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>No designs in this category right now.</p>
      )}
    </>
  );
}

export default CadProductsShowcaseClient;
