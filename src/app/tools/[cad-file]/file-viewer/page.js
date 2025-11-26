import CadHomeDesign from '@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign';
import CadUpload from '@/Components/CadUploadingHome/CadUpload/CadUpload';
import { notFound } from 'next/navigation';

const ALLOWED_CAD_FILES = ['step', 'brep', 'stp' ,'off','obj','iges','igs','stl','brp','ply','glb'];

export async function generateMetadata({ params }) {
  const cadFile = params['cad-file'];
 
  // Access the dynamic route parameter
  // Use the correct parameter name
  
  return {
    title: `${cadFile.toUpperCase()} File Viewer – Instantly Open & Explore ${cadFile.toUpperCase()} Files`,
    description: `View ${cadFile.toUpperCase()} (${cadFile}) files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds. Our proprietary rendering engine ensures smooth performance with zero lag and no glitches, even for large assemblies.`,
    
    openGraph: {
      images: [
        {
          url: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    metadataBase: new URL("https://marathon-os.com"),
    alternates: {
      canonical: `/tools/${cadFile}/file-viewer`,
    },
  };
}

export default function CadFileFormat({ params }) {
  const cadFile = params?.['cad-file']?.toLowerCase();
  if (!ALLOWED_CAD_FILES.includes(cadFile)) {
    return notFound();
  }
  return  <CadHomeDesign type={true}/>;
}