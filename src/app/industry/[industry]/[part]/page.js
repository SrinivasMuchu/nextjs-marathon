import IndustryParts from '@/Components/IndustryParts/IndustryParts';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈

function labelFromSlug(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function wordsFromSlug(slug) {
  return String(slug || '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function generateMetadata({ params }) {
  const industry = params['industry'];
  const part = params['part'];
  const partLabel = labelFromSlug(part);
  const industryLabel = labelFromSlug(industry);

  return {
    title: `${partLabel} CAD Viewer | ${industryLabel} | Marathon OS`,
    description: `Upload and view CAD files online—no software required. Explore components like the ${wordsFromSlug(part)} in the ${wordsFromSlug(industry)} for seamless design collaboration.`,
    openGraph: {
      url: `/industry/${industry}/${part}`,
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
        next: { revalidate: 3600 },
      }),
      fetch(`${BASE_URL}/v1/cad/get-industry-part-data?route=${part}`, {
        method: 'GET',
        next: { revalidate: 3600 },
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
