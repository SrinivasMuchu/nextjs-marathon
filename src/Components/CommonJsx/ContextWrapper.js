"use client";
import React from 'react'
import ContextProvider from './ContextProvider';
import ConverterLoadingOverlayHost from './Loaders/ConverterLoadingOverlayHost';


function ContextWrapper({children}) {
  return (
   <ContextProvider>
    {children}
    <ConverterLoadingOverlayHost />
   </ContextProvider>
  )
}

export default ContextWrapper