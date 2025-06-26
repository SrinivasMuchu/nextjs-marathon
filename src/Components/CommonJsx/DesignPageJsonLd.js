import React from "react";
import { DESIGN_GLB_PREFIX_URL } from "@/config";

function ProductStructuredData({
  designData,
  design,
  type,
  cadReport
}) {
  // Extract data from designData.response
  const productName = designData?.page_title || "CAD Design";
  const description = designData?.page_description || "3D CAD design file available for download";
  const mpn = designData?._id || "";
  const brandName = "Marathon";
  
  // Generate image URLs from the carousel views
  const imageUrls = [
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_0_0.webp`,
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_0_90.webp`,
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_0_270.webp`,
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_90_0.webp`,
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_270_0.webp`,
    `${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_60_30.webp`
  ];

  // Generate download URL based on type
  const downloadUrl = type 
    ? `/library/${design}/${designData._id}.${designData.file_type || 'step'}`
    : `/industry/${design.industry}/${design.part}/${design.design}/${designData._id}.${designData.file_type || 'step'}`;

  // Generate STEP file URL
  const stepFileUrl = type
    ? `/library/${design}/${designData._id}.${designData.file_type || 'step'}`
    : `/industry/${design.industry}/${design.part}/${design.design}/${designData._id}.${designData.file_type || 'step'}`;

  // Generate page URL - fix the undefined issue
  const pageUrl = type
    ? `/library/${design?.industry_design || design}`
    : `/industry/${design.industry}/${design.part}/${design.design_id}`;

  // Extract dimensions from CAD report (similar to AboutCad.js)
  const safeGet = (obj, path, defaultVal = '') => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultVal), obj)
  };

  // Get bounding box dimensions
  const width = cadReport?.bounding_box?.width;
  const height = cadReport?.bounding_box?.height;
  const depth = cadReport?.bounding_box?.depth;
  
  // Format dimensions string
  const dimensions = width != null && height != null && depth != null 
    ? `${width.toFixed(2)} × ${height.toFixed(2)} × ${depth.toFixed(2)} mm`
    : "Variable";

  // Get volume information
  const totalVolume = cadReport?.volumes?.total;
  const volume = totalVolume != null ? `${totalVolume.toFixed(2)} mm³` : "Variable";

  // Get file information
  const fileType = safeGet(cadReport, ['file_info', 'file_type']) || designData.file_type || 'step';
  const units = safeGet(cadReport, ['file_info', 'units']) || 'mm';
  const fileName = safeGet(cadReport, ['file_info', 'file_name']) || designData.page_title;

  // Get geometry information
  const faces = safeGet(cadReport, ['geometry', 'faces']);
  const edges = safeGet(cadReport, ['geometry', 'edges']);
  const vertices = safeGet(cadReport, ['geometry', 'vertices']);
  const solids = safeGet(cadReport, ['geometry', 'solids']);

  // Build additional properties array
  const additionalProperties = [
    {
      "@type": "PropertyValue",
      "name": "Bounding Box (mm)",
      "value": dimensions
    },
    {
      "@type": "PropertyValue", 
      "name": "Volume (mm³)",
      "value": volume
    }
  ];

  // Add geometry properties if available
  if (faces) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Faces",
      "value": faces.toString()
    });
  }
  if (edges) {
    additionalProperties.push({
      "@type": "PropertyValue", 
      "name": "Edges",
      "value": edges.toString()
    });
  }
  if (vertices) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Vertices", 
      "value": vertices.toString()
    });
  }
  if (solids) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Solids",
      "value": solids.toString()
    });
  }

  // Add file type and units
  additionalProperties.push({
    "@type": "PropertyValue",
    "name": "File Type",
    "value": fileType.toUpperCase()
  });

  if (units) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Units",
      "value": units
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": "#product",
        "name": productName,
        "description": description,
        "image": imageUrls,
        "mpn": mpn,
        "brand": {
          "@type": "Brand",
          "name": brandName
        },
        "additionalProperty": additionalProperties,
        "subjectOf": { "@id": "#cadModel" },
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": downloadUrl
        }
      },
      {
        "@type": "3DModel",
        "@id": "#cadModel",
        "name": `${productName} – ${fileType.toUpperCase()} file`,
        "encoding": {
          "@type": "MediaObject",
          "contentUrl": stepFileUrl,
          "encodingFormat": `model/${fileType.toLowerCase()}`
        },
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": { "@id": "#product" }
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        "name": `${productName} – free ${fileType.toUpperCase()} download`,
        "image": imageUrls[0],
        "about": { "@id": "#product" }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export default ProductStructuredData;
