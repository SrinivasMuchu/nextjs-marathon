import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import { BASE_URL } from '@/config';

export async function generateMetadata({ params }) {
  const design = params['design'];
  const industry = params['industry'];
  const part = params['part'];

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?design_route=${design}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const designData = data.data.response; // Adjusted based on your actual response structure

    console.log(designData, 'meta response');

    return {
      title: designData.meta_title ,
      description: designData.meta_description ,
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
        canonical: `/industry/${industry}/${part}/${design}`,
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);

    // Fallback metadata
   
  }
}

export default async function PartDesigns({ params }) {
  const design = params.design;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?design_route=${design}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const normalizedData = {
      ...data.data,
      report: data.data.report || { cad_report: null },
    };

    return <IndustryDesign design={params} designData={normalizedData} />;
  } catch (error) {
    console.error("Failed to fetch design data:", error);
    return <IndustryDesign design={params} designData={null} />;
  }
}
