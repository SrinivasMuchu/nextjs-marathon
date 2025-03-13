import CadUpload from '@/Components/CadUplaodingHome/CadUpload/CadUpload';

export async function generateMetadata({ params }) {
  // Access the dynamic route parameter
  const cadFile = params['cad-file']; // Use the correct parameter name

  return {
    title: `Marathon OS CAD Viewer – Instantly View 3D CAD Files Online | Marathon OS`,
    description: `View ${cadFile.toUpperCase()} (.${cadFile}) files instantly with Marathon OS CAD Viewer. No software installation required—just upload, view, and explore complex 3D models in seconds. Our proprietary rendering engine ensures smooth performance with zero lag and no glitches, even for large assemblies.`,
    robots: "noindex, nofollow",
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

export default function CadFileFormat() {
  return <CadUpload type={true} />;
}