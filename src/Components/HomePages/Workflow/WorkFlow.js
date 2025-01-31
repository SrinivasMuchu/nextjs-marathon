"use client"
import React, { useState } from 'react'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import RequestDemo from './RequestDemo';
import { Boxes } from "./ui/background-boxes"; // Adjust path if necessary
// import { cn } from "@/lib/utils";

function WorkFlow({ openDemoForm, setOpenDemoForm }) {
    // const [openDemoForm, setOpenDemoForm] = useState(false)
    return (




        <div id='home' className={styles["workflow-page"]} style={{ position: 'relative' }}>

            <Boxes className={styles["boxes-bg"]}/>


            <div className={styles["workflow-head"]}>
                <span className={styles["workflow-head-title"]}>Simplify Your Workflow with Cloud PLM & PDM</span>
                <span className={styles["workflow-head-desc"]}>Manage files, Designs, Parts, BOMs, inventory, and purchases effortlessly in one platform.</span>
            </div>
            <div className={styles["workflow-imgs"]}>
                <div className={styles["workflow-img-outer"]}>
                    <div className={styles["workflow-img"]}>

                        <Image
                            src={IMAGEURLS.carLogo}
                            alt="Encryption in transit"
                            loading="lazy"
                            width={100}
                            height={100}
                            
                        />
                        <span>Automotive</span>
                    </div>
                </div>

                <div className={styles["workflow-img-outer"]}>
                    <div className={styles["workflow-img"]}>

                        <Image
                            src={IMAGEURLS.latopLogo}
                            alt="Encryption in transit"
                            width={180}
                            height={180} loading="lazy"
                        />
                        <span>Consumer</span>
                    </div>
                </div>


                <div className={styles["workflow-img-outer"]}>
                    <div className={styles["workflow-img"]}>

                        <Image
                            src={IMAGEURLS.droneLogo}
                            alt="Encryption in transit"
                            width={160}
                            height={100} loading="lazy"
                        />
                        <span>Aerospace</span>
                    </div>
                </div>


                <div className={styles["workflow-img-outer"]}>
                    <div className={styles["workflow-img"]}>

                        <Image
                            src={IMAGEURLS.robotLogo}
                            alt="Encryption in transit"
                            width={160}
                            height={140} loading="lazy"
                        />
                        <span>Medical</span>
                    </div>
                </div>


                <div className={styles["workflow-img-outer"]}>
                    <div className={styles["workflow-img"]}>

                        <Image
                            src={IMAGEURLS.craneLogo}
                            alt="Encryption in transit"
                            width={152}
                            height={180} loading="lazy"
                            className={styles["workflow-crane-img"]}
                        />
                        <span>Machinery</span>
                    </div>
                </div>




            </div>
            <button onClick={() => setOpenDemoForm(!openDemoForm)}>Request demo</button>
        </div>




    )
}

export default WorkFlow