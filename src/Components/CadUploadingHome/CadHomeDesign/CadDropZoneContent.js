"use client"
import { useContext } from "react";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadHomeDropZone from "./CadHomeDropZone"; 

function CadDropZoneContent({children,isStyled,type}) {
 
    const { allowedFormats } = useContext(contextState);

    return <CadHomeDropZone isStyled={isStyled} type={type} allowedFormats={allowedFormats} />;
  
}

export default CadDropZoneContent