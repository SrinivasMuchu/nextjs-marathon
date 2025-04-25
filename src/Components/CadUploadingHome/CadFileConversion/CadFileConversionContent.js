"use client"
import React ,{ useContext } from "react";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadFileUploads from './CadFileUploads'

function CadFileConversionContent({convert}) {
    const { allowedFormats } = useContext(contextState);
  return (
    
    <CadFileUploads convert={convert} allowedFormats={allowedFormats}/>

  )
}

export default CadFileConversionContent