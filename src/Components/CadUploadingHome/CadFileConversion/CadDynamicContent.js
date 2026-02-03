"use client";
import React,{ useContext } from 'react'
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadDynamicHeading from './CadDynamicHeading';

function CadDynamicContent({ conversionParams }) {
    const { paramsText } = useContext(contextState);
  return (
    <CadDynamicHeading paramsText={paramsText} conversionParams={conversionParams} />
  )
}

export default CadDynamicContent