"use client";
import React from 'react'
import ContextProvider from './ContextProvider';


function ContextWrapper({children}) {
  return (
   <ContextProvider>
    {children}
   </ContextProvider>
  )
}

export default ContextWrapper