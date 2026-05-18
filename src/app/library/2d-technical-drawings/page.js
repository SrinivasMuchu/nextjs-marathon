import TwoDLibrary from "@/Components/Library/TwoDLibrary";

export const metadata = {
  title: "2D Technical Drawing Library - Free CAD Drawings | Marathon OS",
  description:
    "Browse free 2D technical drawings generated from 3D CAD models. Download engineering drawing sheets in PDF, SVG and DXF formats for mechanical, robotics, automotive and industrial designs.",
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

