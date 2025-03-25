export const metadata = {
    title: " Free Online 3D File Converter | Convert STEP, IGES, STL, OBJ & More | Marathon OS",
    description:
        "Fast and secure cloud-based 3D file converter. Convert between STEP, IGES, STL, OBJ, PLY, OFF, BREP formats instantly—no software required.",
    openGraph: {
        images: [
            {
                url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
                width: 1200,
                height: 630,
                type: "image/png",
            },
        ],
    }, metadataBase: new URL("https://marathon-os.com"),
    alternates: {
        canonical: "/tools/3d-file-converter",
    },
};
import CadFileConversionHome from '@/Components/CadUploadingHome/CadFileConversion/CadFileConversionHome';
import React from 'react'

function page() {
    return (
        <CadFileConversionHome />
    )
}

export default page
