import IndustryDesignClone from '@/Components/IndustryDesigns/IndustryDesignClone';
import { BASE_URL } from '@/config';
import { notFound } from 'next/navigation'; // 👈

async function page({ params }) {
    const design = params.design_id;

  try {
    const searchParams = new URLSearchParams({
      industry_design_route: design,
      admin: 'true'
    });

    const response = await fetch(`${BASE_URL}/v1/cad/get-industry-part-design?${searchParams}`, {
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

    return <IndustryDesignClone design={design} designData={normalizedData} type='library'/>;
  } catch (error) {
    console.error("Failed to fetch design data:", error);
    notFound(); // 👈 Error = 404
  }
}
export default page