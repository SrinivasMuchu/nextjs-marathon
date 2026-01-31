// app/tools/[from]-to-[to]/page.js
import { ASSET_PREFIX_URL } from '@/config';

export async function generateMetadata({ params }) {
  const [from, to] = (params.conversion || '').split('-to-');


  return {
    title: `Free Online ${from.toUpperCase()} to ${to.toUpperCase()} Converter | Marathon OS`,
    description: `Convert ${from.toUpperCase()} files to ${to.toUpperCase()} online with Marathon OS. Fast, secure conversion.`,
    openGraph: {
      images: [{
        url: `${ASSET_PREFIX_URL}logo-1.png`,
        width: 1200,
        height: 630,
        type: "image/png",
      }],
    },
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/tools/convert/${from}-to-${to}`,
    },
  };
}

import { converterTypes } from '@/common.helper';
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import { notFound } from 'next/navigation';
export default function FileConverterPage({params}) {
 
  const conversion = params.conversion;
  // Debugging: Log the complete params object
  if (!converterTypes.some(type => type.path === `/${conversion}`)) {
    return notFound();
  }
  return <CadFileConversionHome  convert={true} conversionParams={conversion}/>
    
  

  
}