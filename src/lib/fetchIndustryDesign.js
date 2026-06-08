import { cache } from 'react';
import { BASE_URL } from '@/config';

const REVALIDATE_SECONDS = 3600;

async function fetchDesign(queryParam, value) {
  const response = await fetch(
    `${BASE_URL}/v1/cad/get-industry-part-design?${queryParam}=${encodeURIComponent(value)}`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.data) {
    return null;
  }

  return {
    ...data.data,
    report: data.data.report || { cad_report: null },
  };
}

export const fetchIndustryPartDesignByRoute = cache(async (designRoute) =>
  fetchDesign('design_route', designRoute)
);

export const fetchIndustryPartDesignByLibraryRoute = cache(async (libraryRoute) =>
  fetchDesign('industry_design_route', libraryRoute)
);