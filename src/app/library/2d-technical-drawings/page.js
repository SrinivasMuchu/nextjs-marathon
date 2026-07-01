import TwoDLibrary from "@/Components/Library/TwoDLibrary";
import {
  TWO_D_LIBRARY_TITLE,
  TWO_D_LIBRARY_DESCRIPTION,
} from "@/data/twoDLibraryPage";

export const metadata = {
  title: TWO_D_LIBRARY_TITLE,
  description: TWO_D_LIBRARY_DESCRIPTION,
  metadataBase: new URL("https://marathon-os.com"),
  alternates: { canonical: "/library/2d-technical-drawings" },
};

export default function TwoDLibraryListPage({ searchParams }) {
  return (
    <TwoDLibrary
      searchParams={searchParams}
      basePath="/library/2d-technical-drawings"
    />
  );
}

