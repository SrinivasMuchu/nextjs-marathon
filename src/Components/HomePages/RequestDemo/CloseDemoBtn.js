"use client"
import React from 'react'
import Image from "next/image";
import {  IMAGEURLS } from "@/config";

function CloseDemoBtn({onclose}) {
  return (
    <Image
    onClick={onclose}
    src={IMAGEURLS.closeIcon}
    alt="close"
    width={40}
    height={40}
  />
  )
}

export default CloseDemoBtn