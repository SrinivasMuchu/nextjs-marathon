import { getLibraryPath } from "@/common.helper";
import { get2DLibraryPath } from "@/data/twoDLibraryPage";

/** First category on a design: route is the library slug source, label is the crumb text. */
export function categoryCrumbFromDesign(design, library = "3d") {
  const route = String(design?.category_route || "").trim();
  if (!route) return null;
  const labels = Array.isArray(design?.category_labels) ? design.category_labels : [];
  const label = String(labels.map((item) => String(item || "").trim()).find(Boolean) || route).trim();
  if (!label) return null;
  return {
    label,
    href: library === "2d"
      ? get2DLibraryPath({ categoryName: route })
      : getLibraryPath({ categoryName: route }),
  };
}

/** Home is added by the breadcrumb component. Trail: Library › {Category} › {Product}. */
export function libraryProductBreadcrumbs({
  design,
  productLabel,
  productHref,
  library = "3d",
}) {
  const links = [{ label: "Library", href: "/library" }];
  const category = categoryCrumbFromDesign(design, library);
  if (category) links.push(category);
  if (productLabel) {
    links.push(productHref ? { label: productLabel, href: productHref } : { label: productLabel });
  }
  return links;
}
