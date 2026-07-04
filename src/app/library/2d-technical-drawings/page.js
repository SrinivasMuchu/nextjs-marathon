import { redirect } from "next/navigation";
import TwoDLibrary from "@/Components/Library/TwoDLibrary";
import { fetchTwoDLibraryCategories } from "@/api/twoDLibraryDesignsApi";
import { resolveCategorySlugToName } from "@/common.helper";
import {
  TWO_D_LIBRARY_TITLE,
  TWO_D_LIBRARY_DESCRIPTION,
  TWO_D_LIBRARY_BASE,
  get2DLibraryPathWithQuery,
} from "@/data/twoDLibraryPage";

export const metadata = {
  title: TWO_D_LIBRARY_TITLE,
  description: TWO_D_LIBRARY_DESCRIPTION,
  metadataBase: new URL("https://marathon-os.com"),
  alternates: { canonical: TWO_D_LIBRARY_BASE },
};

export default async function TwoDLibraryListPage({ searchParams }) {
  const categoryParam = searchParams?.category;
  const tagsParam = searchParams?.tags;

  if (categoryParam || tagsParam) {
    const categories = await fetchTwoDLibraryCategories();
    const categoryName = categoryParam
      ? resolveCategorySlugToName(categoryParam, categories)
      : null;

    if (tagsParam || categoryName) {
      const {
        category: _category,
        tags: _tags,
        ...rest
      } = searchParams ?? {};
      redirect(
        get2DLibraryPathWithQuery({
          categoryName: categoryName || null,
          tagName: tagsParam || null,
          search: rest.search,
          page: rest.page,
          sort: rest.sort,
          recency: rest.recency,
          free_paid: rest.free_paid,
          file_format: rest.file_format,
          output_format: rest.output_format,
          projection: rest.projection,
        })
      );
    }

    redirect(TWO_D_LIBRARY_BASE);
  }

  return (
    <TwoDLibrary
      searchParams={searchParams}
      basePath={TWO_D_LIBRARY_BASE}
    />
  );
}
