"use client"
import React from 'react'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import { Boxes } from "./ui/background-boxes"; 


function WorkFlow({ openDemoForm, setOpenDemoForm }) {
    const industries = [
        { logo: IMAGEURLS.carLogo, alt: "Automotive", label: "Automotive", width: '100', height: '100' },
        { logo: IMAGEURLS.latopLogo, alt: "Consumer Electronics", label: "Consumer", width: '180', height: '180' },
        { logo: IMAGEURLS.droneLogo, alt: "Aerospace", label: "Aerospace", width: '160', height: '100' },
        { logo: IMAGEURLS.robotLogo, alt: "Medical Equipments", label: "Medical", width: '160', height: '140' },
        { logo: IMAGEURLS.craneLogo, alt: "Machinery", label: "Machinery", extraClass: "workflow-crane-img", width: '152', height: '180' }
    ];
    return (




        <div id='home' className={styles["workflow-page"]} style={{ position: 'relative' }}>

            <Boxes className={styles["boxes-bg"]} />


            <div className={styles["workflow-head"]}>
                <span className={styles["workflow-head-title"]}>Simplify Your Workflow with Cloud PLM & PDM</span>
                <span className={styles["workflow-head-desc"]}>Manage files, Designs, Parts, BOMs, inventory, and purchases effortlessly in one platform.</span>
            </div>
            <div className={styles["workflow-imgs"]}>
                {industries.map(({ logo, alt, label, width,height }, index) => (
                    <div key={index} className={styles["workflow-img-outer"]}>
                        <div className={styles["workflow-img"]}>
                            <Image src={logo} alt={alt} width={width} height={height} layout="responsive" priority />
                            <span>{label}</span>
                        </div>
                    </div>
                ))}
               

            </div>
            <button onClick={() => setOpenDemoForm(!openDemoForm)}>Request demo</button>
        </div>




    )
}

export default WorkFlow