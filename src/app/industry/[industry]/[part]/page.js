import IndustryParts from '@/Components/IndustryParts/IndustryParts';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈

export async function generateMetadata({ params }) {
  const industry = params['industry'];
  const part = params['part'];

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
          url: `${ASSET_PREFIX_URL}logo-1.png`,
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

  try {
    const [industryResponse, partResponse] = await Promise.all([
      fetch(`${BASE_URL}/v1/cad/get-industry-data?route=${industry}`, {
        method: 'GET',
        cache: 'no-store',
      }),
      fetch(`${BASE_URL}/v1/cad/get-industry-part-data?route=${part}`, {
        method: 'GET',
        cache: 'no-store',
      }),
    ]);

    if (!industryResponse.ok || !partResponse.ok) {
      throw new Error(`HTTP error! status: ${industryResponse.status} or ${partResponse.status}`);
    }

    const [industryData, partData] = await Promise.all([
      industryResponse.json(),
      partResponse.json(),
    ]);

    if (!industryData.data || !partData.data) {
      notFound(); // 👈 If either missing, show 404
    }

    const combinedData = {
      ...industryData.data,
      ...partData.data,
    };

    return (
      <IndustryParts 
        industry={industry} 
        part_name={part} 
        industryData={combinedData} 
      />
    );
  } catch (error) {
    console.error("Failed to fetch industry/part data:", error);
    notFound(); // 👈 Error = 404
  }
}

export default IndustryPart;
