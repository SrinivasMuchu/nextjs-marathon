// app/tools/[from]-to-[to]/page.js
export async function generateMetadata({ params }) {
  const [from, to] = (params.conversion || '').split('-to-');


  return {
    title: `Free Online ${from.toUpperCase()} to ${to.toUpperCase()} Converter | Marathon OS`,
    description: `Convert ${from.toUpperCase()} files to ${to.toUpperCase()} online with Marathon OS. Fast, secure conversion.`,
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
      canonical: `/tools/convert/${from}-to-${to}`,
    },
  };
}

import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';

export default function FileConverterPage() {
  
  // Debugging: Log the complete params object
  return <CadFileConversionHome  convert={true}/>
    
  

  
}