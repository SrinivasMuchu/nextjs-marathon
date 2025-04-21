import Industry from "@/Components/IndustriesPages/Industry";
import { BASE_URL } from '@/config';


export async function generateMetadata({ params }) {
  const industry = params['industry'];

  
  
  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-data?route=${industry}`, {
      method: 'GET',
      
      next: { revalidate: 3600 } // Optional revalidation
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      title: data.data.meta_title,
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
    return {
      title: `${industry.toUpperCase()} File Viewer...`,
      description: `View ${industry.toUpperCase()} (${industry}) files instantly...`,
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
  }
}

export default async function IndustryPage({ params }) {
  const industry = params.industry;


  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-data?route=${industry}`, {
      method: 'GET',
     
      next: { revalidate: 3600 }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log(industry, 'industry');
    return <Industry industry={params.industry} industryData={data.data} />;
  } catch (error) {
    console.error("Failed to fetch industry data:", error);
    return <Industry industry={params.industry} industryData={null} />;
  }
}