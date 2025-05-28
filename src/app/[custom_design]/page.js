import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign'
import React from 'react'
import { BASE_URL } from '@/config';

export async function generateMetadata({ params }) {
  const design = params['custom_design'];

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?design_route=${design}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const designData = data.data.response; // Adjusted based on your actual response structure

    

    return {
      title: `${designData.meta_title} | Marathon OS` ,
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
    //   alternates: {
    //     canonical: `/industry/${industry}/${part}/${design}`,
    //   },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
   
  }
}

export default async function PartDesigns({ params }) {
  const design = params.custom_design;

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

    return <IndustryDesign design={design} designData={normalizedData} page_type='custom'/>;
  } catch (error) {
    console.error("Failed to fetch design data:", error);
    return <IndustryDesign design={design} designData={null}  page_type='custom'/>;
  }
}
