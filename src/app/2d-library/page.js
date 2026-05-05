import TwoDLibrary from "@/Components/Library/TwoDLibrary";

export const metadata = {
  title: "2D Design Library | Marathon OS",
  description:
    "Browse Marathon OS 2D-ready engineering designs and open technical drawing sets.",
  metadataBase: new URL("https://marathon-os.com"),
  alternates: { canonical: "/2d-library" },
};

export default function TwoDLibraryPage({ searchParams }) {
  return <TwoDLibrary searchParams={searchParams} basePath="/2d-library" />;
}

