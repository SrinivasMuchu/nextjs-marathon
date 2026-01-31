import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈

// Cache the HTML for this page for a short time (ISR),
// so it is still SSR but with much faster TTFB on repeat visits.
export const revalidate = 60; // seconds

export async function generateMetadata({ params }) {
  const design = params.industry_design;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/design-meta-data?route=${design}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const designData = data.data;

    if (!designData) {
      notFound(); // 👈 If design not found, 404
    }

    return {
      title: `${designData.meta_title} | Marathon OS`,
      description: designData.meta_description,
      openGraph: {
        images: [
          {
            url: `${ASSET_PREFIX_URL}logo-1.png`,
            width: 1200,
            height: 630,
            type: "image/png",
          },
        ],
      },
      metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: `/library/${design}`,
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    notFound(); // 👈 Error fetching? 404
  }
}

export default async function LibraryDesign({ params }) {
  const design = params.industry_design;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${design}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      notFound(); // 👈 If design data missing, 404
    }

    const normalizedData = {
      ...data.data,
      report: data.data.report ,
    };

    return <IndustryDesign design={design} designData={normalizedData} type='library'/>;
  } catch (error) {
    console.error("Failed to fetch design data:", error);
    notFound(); // 👈 Error = 404
  }
}
