"use client";
import React,{ useContext } from 'react'
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadDynamicHeading from './CadDynamicHeading';

function CadDynamicContent() {
    const { paramsText} = useContext(contextState);
  return (
    <CadDynamicHeading paramsText={paramsText}/>
  )
}

export default CadDynamicContent