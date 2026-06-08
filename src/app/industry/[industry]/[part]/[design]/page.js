import IndustryDesign from '@/Components/IndustryDesigns/IndustryDesign';
import { ASSET_PREFIX_URL } from '@/config';
import { fetchIndustryPartDesignByRoute } from '@/lib/fetchIndustryDesign';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { design, industry, part } = params;

  try {
    const designData = await fetchIndustryPartDesignByRoute(design);
    const res = designData?.response;

    if (!res) {
      notFound();
    }

    const title = res.meta_title || res.page_title;
    const description = res.meta_description || res.page_description;

    return {
      title: `${title} | Marathon OS`,
      description,
      openGraph: {
        images: [
          {
            url: `${ASSET_PREFIX_URL}logo-1.png`,
            width: 1200,
            height: 630,
            type: 'image/png',
          },
        ],
      },
      metadataBase: new URL('https://marathon-os.com'),
      alternates: {
        canonical: `/industry/${industry}/${part}/${design}`,
      },
    };
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    notFound();
  }
}

export default async function PartDesigns({ params }) {
  const { design } = params;

  try {
    const normalizedData = await fetchIndustryPartDesignByRoute(design);

    if (!normalizedData) {
      notFound();
    }

    return <IndustryDesign design={params} designData={normalizedData} />;
  } catch (error) {
    console.error('Failed to fetch design data:', error);
    notFound();
  }
}
