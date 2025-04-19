import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign'
import { BASE_URL } from '@/config';
import { cookies } from 'next/headers';

export async function generateMetadata({ params }) {
  const design = params['design'];
  const industry = params['industry'];
  const part = params['part'];

  const cookieStore = cookies();
  const userUUID = cookieStore.get('uuid')?.value;
  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?grab_cad_title=${design}`, {
      method: 'GET',
      headers: {
        'user-uuid': userUUID || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      title: data.data.meta_title || `${design.toUpperCase()} File Viewer`,
      description: data.data.meta_description || `View ${design.toUpperCase()} CAD files online`,
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
        canonical: `/industry/${industry}/${part}/${design}`,
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return {
      title: `${design.toUpperCase()} File Viewer`,
      description: `View ${design.toUpperCase()} CAD files online`,
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
        canonical: `/industry/${industry}/${part}/${design}`,
      },
    };
  }
}

export default async function PartDesigns({ params }) {
  const design = params.design;
  const cookieStore = cookies();
  const userUUID = cookieStore.get('uuid')?.value;

  try {
    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?grab_cad_title=${design}`, {
      method: 'GET',
      headers: {
        'user-uuid': userUUID || '',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    // Ensure the data structure matches what your components expect
    const normalizedData = {
      ...data.data,
      report: data.data.report || { cad_report: null }
    };

    return <IndustryDesign design={params} designData={data.data} />;
  } catch (error) {
    console.error("Failed to fetch design data:", error);
    return <IndustryDesign design={design} designData={null} />;
  }
}