import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function fetchDesignByRoute(designRoute) {
  if (!BASE_URL) return null;
  try {
    const url = `${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${encodeURIComponent(
      designRoute
    )}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data?.response || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  return {
    title: "2D Technical Drawings | Marathon OS",
    description:
      "AI-assisted 2D technical drawing set: sheets, dimensions metadata, and downloads (PDF, SVG, DXF).",
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/library/2d-technical-drawing/${encodeURIComponent(designRoute)}`,
    },
  };
}

async function TwoDTechnicalDrawingDeferredContent({ designId }) {
  const bundle = await fetchTechDrawBundle(designId);
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }
  const props = mapTechDrawBundleToPageProps(designId, bundle);
  const { baseUrl: _u, ...contentProps } = props;
  return <TwoDTechnicalDrawingContent {...contentProps} currentDesignId={designId} />;
}

function TwoDTechnicalDrawingInitialFallback({ designId }) {
  const firstSheet = `${TECH_DRAW_LIBRARY_PREFIX}/${designId}/svg/sheet_1.svg`;
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        background: "#fff",
        marginTop: 8,
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        Loading full drawing details...
      </div>
      <div
        style={{
          height: 320,
          background: "#eef2f7",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={firstSheet}
          alt="Drawing preview"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", background: "#fff" }}
        />
      </div>
    </div>
  );
}

export default async function TwoDTechnicalDrawingByDesignRoutePage({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  if (!designRoute) notFound();

  const design = await fetchDesignByRoute(designRoute);
  const designId = String(design?._id || "").trim();
  if (!/^[a-f0-9]{24}$/i.test(designId)) notFound();
  const title = String(design?.page_title || design?.part_name || "2D Technical Drawing Set").trim();
  const breadcrumbLinks = [
    { label: "Library", href: "/library" },
    {
      label: title,
      href: `/library/${encodeURIComponent(designRoute)}`,
    },
    { label: "2D Technical Drawings", href: `/library/2d-technical-drawing/${encodeURIComponent(designRoute)}` },
  ];
  const heroProps = {
    title: `${title} — 2D Technical Drawing Set`,
    tags: [],
    // Initial paint: keep lightweight placeholders until full JSON loads.
    stats: [
      { value: "—", label: "Drawing Sheets" },
      { value: "—", label: "Views Analysed" },
      { value: "3", label: "Export Formats" },
      { value: "—", label: "Section Cuts" },
      { value: "1st Angle", label: "Projection" },
    ],
    showBadges: true,
  };

  return (
    <TwoDTechnicalDrawingPage breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
      <Suspense fallback={<TwoDTechnicalDrawingInitialFallback designId={designId} />}>
        <TwoDTechnicalDrawingDeferredContent designId={designId} />
      </Suspense>
    </TwoDTechnicalDrawingPage>
  );
}

