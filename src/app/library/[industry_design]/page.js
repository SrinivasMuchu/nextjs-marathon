import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import { BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈

export async function generateMetadata({ params }) {
    const design = params.industry_design;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/design-meta-data?route=${design}`, {
      method: 'GET',
      cache: 'no-store',
    });

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
            url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
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
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?industry_design_route=${design}`, {
      method: 'GET',
      cache: 'no-store',
    });

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
