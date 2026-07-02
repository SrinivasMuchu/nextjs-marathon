"use client"
import { useContext } from "react";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadHomeDropZone from "./CadHomeDropZone"; 

function CadDropZoneContent({ children, isStyled, type, cadType, designVariant, dropzoneId }) {
 
    const { allowedFormats } = useContext(contextState);

    return (
      <CadHomeDropZone
        isStyled={isStyled}
        type={type}
        cadType={cadType}
        allowedFormats={allowedFormats}
        designVariant={designVariant}
        dropzoneId={dropzoneId}
      />
    );
  
}

export default CadDropZoneContent
