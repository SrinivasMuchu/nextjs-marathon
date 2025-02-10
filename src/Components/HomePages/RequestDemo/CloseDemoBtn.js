import React from 'react'
import Image from "next/image";
import {  IMAGEURLS } from "@/config";

function CloseDemoBtn({onclose,styles}) {
  return (
    <Image
    className={styles['demo-popup-close']}
    onClick={onclose}
    src={IMAGEURLS.closeIcon}
    alt="close"
    width={100}
    height={100}
  />
  )
}

export default CloseDemoBtn