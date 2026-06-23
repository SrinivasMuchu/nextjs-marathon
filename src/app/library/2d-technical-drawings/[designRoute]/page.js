import TwoDTechnicalDrawingPage from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPage";
import TwoDTechnicalDrawingContent from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContent";
import TwoDTechnicalDrawingPageJsonLd from "@/Components/JsonLdSchemas/TwoDTechnicalDrawingPageJsonLd";
import { BASE_URL, TECH_DRAW_LIBRARY_PREFIX } from "@/config";
import { fetchTechDrawBundle } from "@/lib/techDraw/fetchTechDrawBundle";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

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

async function fetchLightHeroStats(designId) {
  try {
    const base = `${TECH_DRAW_LIBRARY_PREFIX}/${designId}`;
    const res = await fetch(`${base}/geometry_per_sheet.json`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const geo = await res.json();
    const entries = geo && typeof geo === "object" ? Object.values(geo) : [];
    const views = new Set(
      entries.map((e) => String(e?.view_name || "").trim()).filter(Boolean)
    ).size;
    const sections = entries.filter((e) => {
      const label = String(e?.label || "");
      const view = String(e?.view_name || "");
      return /section/i.test(label) || /^section/i.test(view);
    }).length;
    return {
      sheets: entries.length,
      views,
      sections,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const designRoute = String(params?.designRoute || "").trim();
  const design = await fetchDesignByRoute(designRoute);
  const productName = String(
    design?.page_title ||
      design?.part_name ||
      designRoute.replace(/-/g, " ").trim() ||
      "Product"
  ).trim();
  return {
    title: `${productName} 2D Technical Drawing - PDF, SVG & DXF | Marathon OS`,
    description:
      `Download free 2D technical drawings for the ${productName} CAD model. Includes front, top, side and section views with PDF, SVG and DXF drawing sheet formats.`,
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/library/2d-technical-drawings/${encodeURIComponent(designRoute)}`,
    },
  };
}

async function TwoDTechnicalDrawingDeferredContent({ designId, cadModelHref }) {
  const bundle = await fetchTechDrawBundle(designId);
  if (!bundle.geometryPerSheet || typeof bundle.geometryPerSheet !== "object") {
    notFound();
  }
  const props = mapTechDrawBundleToPageProps(designId, bundle);
  const { baseUrl: _u, ...contentProps } = props;
  return (
    <TwoDTechnicalDrawingContent
      {...contentProps}
      cadModelHref={cadModelHref}
      currentDesignId={designId}
    />
  );
}

function TwoDTechnicalDrawingInitialFallback({ designId, cadModelHref }) {
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
      {cadModelHref ? (
        <div style={{ marginBottom: 12 }}>
          <Link
            href={cadModelHref}
            prefetch
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "#5b21b6",
              textDecoration: "none",
            }}
          >
            ← Open 3D CAD model page
          </Link>
        </div>
      ) : null}
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
  const lightStats = await fetchLightHeroStats(designId);
  const title = String(design?.page_title || design?.part_name || "2D Technical Drawing Set").trim();
  const cadModelHref = `/library/${encodeURIComponent(designRoute)}`;
  const breadcrumbLinks = [
    { label: "Library", href: "/library" },
    { label: "2D Technical Drawings", href: "/library/2d-technical-drawings" },
    { label: title },
  ];
  const pageDescription = `Download free 2D technical drawings for the ${title} CAD model. Includes front, top, side and section views with PDF, SVG and DXF drawing sheet formats.`;

  const heroProps = {
    title: `${title} — 2D Technical Drawing Set (2D CAD drawings)`,
    tags: [],
    stats: [
      { value: String(lightStats?.sheets ?? "0"), label: "Drawing Sheets" },
      { value: String(lightStats?.views ?? "0"), label: "Views Analysed" },
      { value: "3", label: "Export Formats" },
      { value: String(lightStats?.sections ?? "0"), label: "Section Cuts" },
      { value: "1st Angle", label: "Projection" },
    ],
    showBadges: true,
  };

  return (
    <>
      <TwoDTechnicalDrawingPageJsonLd
        designRoute={designRoute}
        designId={designId}
        pageTitle={title}
        description={pageDescription}
      />
      <TwoDTechnicalDrawingPage breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
        <Suspense
          fallback={
            <TwoDTechnicalDrawingInitialFallback designId={designId} cadModelHref={cadModelHref} />
          }
        >
          <TwoDTechnicalDrawingDeferredContent designId={designId} cadModelHref={cadModelHref} />
        </Suspense>
      </TwoDTechnicalDrawingPage>
    </>
  );
}

