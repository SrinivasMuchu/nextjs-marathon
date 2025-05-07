import Industry from "@/Components/IndustriesPages/Industry";
import { BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈 Important

export async function generateMetadata({ params }) {
  const industry = params['industry'];

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-data?meta_route=${industry}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      notFound(); // 👈 No data = 404
    }

    return {
      title: `${data.data.meta_title} | Marathon OS`,
      description: data.data.meta_description,
      openGraph: {
        images: [{
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
          width: 1200,
          height: 630,
          type: "image/png",
        }],
      },
      metadataBase: new URL("https://marathon-os.com"),
      alternates: {
        canonical: `/industry/${industry}`,
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    notFound(); // 👈 On error = 404
  }
}

export default async function IndustryPage({ params }) {
  const industry = params.industry;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-data?route=${industry}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!data.data) {
      notFound(); // 👈 No data = 404
    }

    return <Industry industry={params.industry} industryData={data.data} />;
  } catch (error) {
    console.error("Failed to fetch industry data:", error);
    notFound(); // 👈 Error = 404
  }
}
