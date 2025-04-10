
import IndustryParts from '@/Components/IndustryParts/IndustryParts'
import React from 'react'
import { BASE_URL } from '@/config';
import { cookies } from 'next/headers';

export async function generateMetadata({ params }) {
  const industry = params['industry'];
  const part = params['part'];
  
  // Get cookies from the request
  return {
    title: `${part.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')} Head CAD Viewer | ${industry.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')} | Marathon OS`,
    description: `Upload and view CAD files online—no software required. Explore components like the ${part.replace('-', ' ')} Head in the ${industry.replace('-', ' ')} for seamless design collaboration.`,
    
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
      canonical: `/industry/${industry}/${part}`,
    },
  };
}

async function IndustryPart({ params }) {
    const industry = params.industry;
    const part = params.part;
   
    const cookieStore = cookies();
    const userUUID = cookieStore.get('uuid')?.value;
    try {
      const headers = {
        'user-uuid': userUUID || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const [industryResponse, additionalDataResponse] = await Promise.all([
        fetch(`${BASE_URL}/v1/cad/get-industry-data?route=${industry}`, {
          method: 'GET',
          headers,
          next: { revalidate: 3600 }
        }),
        fetch(`${BASE_URL}/v1/cad/get-industry-part-data?route=${part}`, {
          method: 'GET',
          headers,
          next: { revalidate: 3600 }
        })
      ]);

      if (!industryResponse.ok || !additionalDataResponse.ok) {
        throw new Error(`HTTP error! status: ${industryResponse.status} or ${additionalDataResponse.status}`);
      }
      
      const [industryData, additionalData] = await Promise.all([
        industryResponse.json(),
        additionalDataResponse.json()
      ]);
      console.log(additionalData.data)
      // Combine the data
      const combinedData = {
        ...industryData.data,
        ...additionalData.data
      };
     console.log(industry)
      return <IndustryParts 
        industry={industry} 
        part_name={part} 
        industryData={combinedData} 
      />;
    } catch (error) {
      console.error("Failed to fetch industry data:", error);
      return <IndustryParts 
        industry={params.industry} 
        part_name={params.part} 
        industryData={null} 
      />;
    }
}

export default IndustryPart