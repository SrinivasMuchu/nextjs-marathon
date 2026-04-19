"use client";
import React,{ useContext } from 'react'
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import CadDynamicHeading from './CadDynamicHeading';

function CadDynamicContent({ conversionParams, heroTone }) {
    const { paramsText } = useContext(contextState);
  return (
    <CadDynamicHeading paramsText={paramsText} conversionParams={conversionParams} heroTone={heroTone} />
  )
}

export default CadDynamicContent